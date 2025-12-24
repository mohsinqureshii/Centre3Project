import { Router } from "express";
import prisma from "../../prisma.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

const router = Router();

/**
 * GET lock events
 */
router.get("/", requireRole("SUPER_ADMIN"), async (_req, res) => {
  try {
    const events = await prisma.zoneLockEvent.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(events);
  } catch (err) {
    console.error("Error fetching lock events:", err);
    res.status(500).json({ message: "Failed to fetch lock events" });
  }
});

/**
 * LOCK or UNLOCK a zone
 */
router.post("/", requireRole("SUPER_ADMIN"), async (req, res) => {
  try {
    const { zoneId, state, reason } = req.body;

    const event = await prisma.zoneLockEvent.create({
      data: {
        zoneId,
        state,
        reason,
        actorId: (req as any).user?.id || "system",
      },
    });

    res.status(201).json(event);
  } catch (err) {
    console.error("Emergency lock error:", err);
    res.status(500).json({ message: "Failed to update zone lock state" });
  }
});

export default router;
