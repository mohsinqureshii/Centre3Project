import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  approveRequest,
  rejectRequest,
  returnRequestForChanges,
  listApprovalInbox,
} from "./approvals.service.js";

const router = Router();

/**
 * Inbox — pending approvals for current user role
 */
router.get("/inbox", authMiddleware, async (req, res) => {
  try {
    const role = (req as any).user.role;
    const items = await listApprovalInbox(role);
    res.json(items);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

/**
 * Approve
 */
router.post("/requests/:id/approve", authMiddleware, async (req, res) => {
  try {
    await approveRequest(req.params.id, (req as any).user.id, req.body?.comment);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * Reject
 */
router.post("/requests/:id/reject", authMiddleware, async (req, res) => {
  try {
    await rejectRequest(req.params.id, (req as any).user.id, req.body?.comment);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

/**
 * Return for changes
 */
router.post("/requests/:id/return", authMiddleware, async (req, res) => {
  try {
    await returnRequestForChanges(
      req.params.id,
      (req as any).user.id,
      req.body?.comment
    );
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
});

export default router;
