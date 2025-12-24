import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../../prisma.js";
import { approve, reject, returnForChanges } from "./approvalsEngine.js";
import { z } from "zod";

export const approvalsRouter = Router();

approvalsRouter.get("/inbox", authMiddleware, async (req, res) => {
  const role = req.user!.role as any;
  const stages = await prisma.requestStageInstance.findMany({
    where: { approverRole: role, status: "PENDING", request: { status: "IN_APPROVAL" } },
    orderBy: [{ request: { createdAt: "desc" } }, { stageOrder: "asc" }],
    include: { request: { include: { location: true } } },
    take: 200,
  });

  return res.json(stages.map(s => ({
    requestId: s.requestId,
    requestNo: s.request.requestNo,
    requestType: s.request.requestType,
    requestorName: s.request.requestorName,
    siteName: s.request.location.siteName,
    stageOrder: s.stageOrder,
    stageName: s.stageName,
    submittedAt: s.request.updatedAt,
    vip: s.request.vip,
    status: s.request.status,
  })));
});

approvalsRouter.post("/requests/:id/approve", authMiddleware, async (req, res) => {
  const schema = z.object({ comment: z.string().optional().nullable() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid payload" });
  try {
    return res.json(await approve(req.params.id, req.user!.id, req.user!.role, parsed.data.comment ?? undefined));
  } catch (e: any) { return res.status(400).json({ message: e.message ?? "Failed" }); }
});

approvalsRouter.post("/requests/:id/reject", authMiddleware, async (req, res) => {
  const schema = z.object({ comment: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Comment is required" });
  try {
    return res.json(await reject(req.params.id, req.user!.id, req.user!.role, parsed.data.comment));
  } catch (e: any) { return res.status(400).json({ message: e.message ?? "Failed" }); }
});

approvalsRouter.post("/requests/:id/return", authMiddleware, async (req, res) => {
  const schema = z.object({ comment: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Comment is required" });
  try {
    return res.json(await returnForChanges(req.params.id, req.user!.id, req.user!.role, parsed.data.comment));
  } catch (e: any) { return res.status(400).json({ message: e.message ?? "Failed" }); }
});
