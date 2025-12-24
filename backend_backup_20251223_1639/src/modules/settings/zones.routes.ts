import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

export const zonesRouter = Router();

/**
 * CREATE ZONE
 */
zonesRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const { locationId, name, code, isLockable } = req.body;

    if (!locationId || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const zone = await prisma.zone.create({
      data: {
        locationId,
        name,
        code: code || null,
        isLockable: isLockable ?? true,
      },
    });

    res.json(zone);
  } catch (err: any) {
    console.error("ZONE CREATE ERROR:", err);
    res.status(500).json({
      message: "Zone creation failed",
      error: err.message,
    });
  }
});

/**
 * LIST ZONES
 */
zonesRouter.get("/", authMiddleware, async (_req, res) => {
  const zones = await prisma.zone.findMany({
    include: { location: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(zones);
});
