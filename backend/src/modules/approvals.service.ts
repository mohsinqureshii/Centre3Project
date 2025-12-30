import prisma from "../prisma.js";
import { ApprovalAction } from "@prisma/client";
import { buildApprovalFlow } from "./approvalsEngine.js";

/**
 * List pending approvals for a role
 */
export async function listApprovalInbox(role: string) {
  const stages = await prisma.requestStageInstance.findMany({
    where: {
      approverRole: role as any,
      status: "PENDING",
      request: {
        status: "IN_APPROVAL",
      },
    },
    orderBy: {
      request: { createdAt: "desc" },
    },
    include: {
      request: {
        include: {
          location: true,
        },
      },
    },
  });

  return stages.map((s) => ({
    stageId: s.id,
    requestId: s.requestId,
    requestNo: s.request.requestNo,
    requestType: s.request.requestType,
    requestorName: s.request.requestorName,
    siteName: s.request.location!.siteName,
    submittedAt: s.request.updatedAt,
    vip: s.request.vip,
    status: s.request.status,
  }));
}

export async function approveRequest(
  requestId: string,
  actorId: string,
  comment?: string
) {
  await actOnRequest(requestId, actorId, ApprovalAction.APPROVE, comment);
}

export async function rejectRequest(
  requestId: string,
  actorId: string,
  comment?: string
) {
  await actOnRequest(requestId, actorId, ApprovalAction.REJECT, comment);
}

export async function returnRequestForChanges(
  requestId: string,
  actorId: string,
  comment?: string
) {
  await actOnRequest(
    requestId,
    actorId,
    ApprovalAction.RETURN_FOR_CHANGES,
    comment
  );
}

async function actOnRequest(
  requestId: string,
  actorId: string,
  action: ApprovalAction,
  comment?: string
) {
  const stage = await prisma.requestStageInstance.findFirst({
    where: {
      requestId,
      status: "PENDING",
    },
    orderBy: { stageOrder: "asc" },
  });

  if (!stage) throw new Error("No pending approval stage");

  await prisma.requestStageInstance.update({
    where: { id: stage.id },
    data: {
      status:
        action === ApprovalAction.APPROVE ? "APPROVED" : "REJECTED",
      decidedByUserId: actorId,
      decidedAt: new Date(),
      comment: comment ?? null,
    },
  });

  await prisma.approvalLog.create({
    data: {
      requestId,
      action,
      comment: comment ?? null,
      actorId,
    },
  });

  if (action === ApprovalAction.APPROVE) {
    await buildApprovalFlow(requestId);
  } else {
    await prisma.accessRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });
  }
}
