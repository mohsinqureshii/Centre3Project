import prisma from "../../prisma.js";
import { RequestStatus, ApprovalAction } from "@prisma/client";

type Cond = any;

function compare(op: string, left: any, right: any): boolean {
  switch (op) {
    case "eq": return left === right;
    case "neq": return left !== right;
    case "in": return Array.isArray(right) ? right.includes(left) : false;
    case "notIn": return Array.isArray(right) ? !right.includes(left) : false;
    case "gt": return left > right;
    case "gte": return left >= right;
    case "lt": return left < right;
    case "lte": return left <= right;
    default: return false;
  }
}

function evalCond(cond: Cond | null | undefined, ctx: Record<string, any>): boolean {
  if (!cond) return true;
  if (cond.and) return cond.and.every((c: any) => evalCond(c, ctx));
  if (cond.or) return cond.or.some((c: any) => evalCond(c, ctx));
  return compare(String(cond.op), ctx[cond.field], cond.value);
}

export async function pickProcessForRequest(reqId: string) {
  const req = await prisma.accessRequest.findUnique({ where: { id: reqId }});
  if (!req) throw new Error("Request not found");

  if (req.processId) return prisma.processDefinition.findUnique({ where: { id: req.processId }, include: { stages: true }});

  if (req.activityId) {
    const act = await prisma.activity.findUnique({ where: { id: req.activityId }});
    if (act?.defaultProcessId) {
      const proc = await prisma.processDefinition.findUnique({ where: { id: act.defaultProcessId }, include: { stages: true }});
      if (proc?.isActive) return proc;
    }
  }

  return prisma.processDefinition.findFirst({
    where: { requestType: req.requestType, isActive: true },
    include: { stages: true },
    orderBy: { name: "asc" },
  });
}

export async function generateStagesOnSubmit(reqId: string) {
  const req = await prisma.accessRequest.findUnique({ where: { id: reqId }});
  if (!req) throw new Error("Request not found");

  const proc = await pickProcessForRequest(reqId);
  if (!proc) throw new Error("No active process configured for this request type");

  let riskLevel: string | null = null;
  if (req.activityId) {
    const act = await prisma.activity.findUnique({ where: { id: req.activityId }});
    riskLevel = act?.riskLevel ?? null;
  }

  let movementType: string | null = null;
  try {
    if (req.comments) {
      const parsed = JSON.parse(req.comments);
      movementType = parsed?.formData?.movementType ?? parsed?.movementType ?? null;
    }
  } catch {}

  const ctx = { vip: req.vip, requestType: req.requestType, locationId: req.locationId, zoneId: req.zoneId, riskLevel, movementType };

  await prisma.requestStageInstance.deleteMany({ where: { requestId: reqId }});

  const stagesSorted = [...proc.stages].sort((a,b)=>a.stageOrder-b.stageOrder);
  for (const s of stagesSorted) {
    const ok = evalCond(s.conditionJson as any, ctx);
    await prisma.requestStageInstance.create({
      data: { requestId: reqId, stageOrder: s.stageOrder, stageName: s.name, approverRole: s.approverRole, status: ok ? "PENDING" : "SKIPPED" }
    });
  }

  await prisma.accessRequest.update({ where: { id: reqId }, data: { status: RequestStatus.IN_APPROVAL, processId: proc.id }});
  return { processId: proc.id };
}

export async function getCurrentPendingStage(reqId: string) {
  return prisma.requestStageInstance.findFirst({ where: { requestId: reqId, status: "PENDING" }, orderBy: { stageOrder: "asc" }});
}

export async function ensureCanAct(reqId: string, actorId: string, actorRole: string) {
  const req = await prisma.accessRequest.findUnique({ where: { id: reqId }});
  if (!req) throw new Error("Request not found");
  if (req.status !== RequestStatus.IN_APPROVAL) throw new Error("Request not in approval");

  const stage = await getCurrentPendingStage(reqId);
  if (!stage) throw new Error("No pending stage");
  if (stage.approverRole !== actorRole) throw new Error("Not authorized for current stage");

  const actor = await prisma.user.findUnique({ where: { id: actorId }});
  if (actor && actor.email === req.requestorEmail) throw new Error("Self-approval is not allowed");

  return { req, stage };
}

export async function approve(reqId: string, actorId: string, actorRole: string, comment?: string) {
  const { stage } = await ensureCanAct(reqId, actorId, actorRole);

  await prisma.requestStageInstance.update({ where: { id: stage.id }, data: { status: "APPROVED", decidedByUserId: actorId, decidedAt: new Date(), comment: comment ?? null }});
  await prisma.approvalLog.create({ data: { requestId: reqId, action: ApprovalAction.APPROVE, comment: comment ?? null, actorId }});
  await prisma.auditLog.create({ data: { actorId, entity: "AccessRequest", entityId: reqId, action: "APPROVE_STAGE", meta: { stageOrder: stage.stageOrder, stageName: stage.stageName } }});

  const next = await getCurrentPendingStage(reqId);
  if (!next) {
    await prisma.accessRequest.update({ where: { id: reqId }, data: { status: RequestStatus.APPROVED }});
    await prisma.auditLog.create({ data: { actorId, entity: "AccessRequest", entityId: reqId, action: "REQUEST_APPROVED", meta: {} }});
  }
  return { ok: true };
}

export async function reject(reqId: string, actorId: string, actorRole: string, comment: string) {
  if (!comment?.trim()) throw new Error("Comment is required");
  const { stage } = await ensureCanAct(reqId, actorId, actorRole);

  await prisma.requestStageInstance.update({ where: { id: stage.id }, data: { status: "REJECTED", decidedByUserId: actorId, decidedAt: new Date(), comment }});
  await prisma.approvalLog.create({ data: { requestId: reqId, action: ApprovalAction.REJECT, comment, actorId }});
  await prisma.accessRequest.update({ where: { id: reqId }, data: { status: RequestStatus.REJECTED }});
  await prisma.auditLog.create({ data: { actorId, entity: "AccessRequest", entityId: reqId, action: "REQUEST_REJECTED", meta: { stageOrder: stage.stageOrder, stageName: stage.stageName } }});
  return { ok: true };
}

export async function returnForChanges(reqId: string, actorId: string, actorRole: string, comment: string) {
  if (!comment?.trim()) throw new Error("Comment is required");
  const { stage } = await ensureCanAct(reqId, actorId, actorRole);

  await prisma.requestStageInstance.update({ where: { id: stage.id }, data: { status: "REJECTED", decidedByUserId: actorId, decidedAt: new Date(), comment }});
  await prisma.approvalLog.create({ data: { requestId: reqId, action: ApprovalAction.RETURN_FOR_CHANGES, comment, actorId }});

  await prisma.accessRequest.update({ where: { id: reqId }, data: { status: RequestStatus.DRAFT }});
  await prisma.requestStageInstance.deleteMany({ where: { requestId: reqId }});
  await prisma.auditLog.create({ data: { actorId, entity: "AccessRequest", entityId: reqId, action: "RETURN_FOR_CHANGES", meta: { fromStage: stage.stageName } }});
  return { ok: true };
}
