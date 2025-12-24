import { Router } from "express";
import prisma from "../../prisma.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";

const router = Router();

/**
 * GET all alerts (Admin only)
 */
router.get("/", requireRole("SUPER_ADMIN"), async (_req, res) => {
  try {
    const alerts = await prisma.securityAlert.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(alerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
});

/**
 * CREATE an alert
 */
router.post("/", requireRole("SUPER_ADMIN"), async (req, res) => {
  try {
    const { title, severity, description, locationId, zoneId, room } = req.body;

    const alert = await prisma.securityAlert.create({
      data: {
        title,
        severity,
        description,
        locationId,
        zoneId,
        room,
      },
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ message: "Failed to create alert" });
  }
});

export default router;
