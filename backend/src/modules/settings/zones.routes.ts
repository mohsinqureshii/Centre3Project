import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/settings/zones
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const zones = await prisma.zone.findMany({
      include: {
        location: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // FIX: Location does NOT have `.name` → return `siteName` instead
    const formatted = zones.map((z) => ({
      id: z.id,
      name: z.name,
      code: z.code,
      isLockable: z.isLockable,
      locationId: z.locationId,
      locationName: z.location?.siteName || "-", // FIXED
    }));

    res.json(formatted);
  } catch (e) {
    console.error("ZONE LIST ERROR:", e);
    res.status(500).json({ message: "Failed to load zones" });
  }
});

/**
 * POST /api/settings/zones
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { locationId, name, code, isLockable } = req.body;

    if (!locationId || !name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const zone = await prisma.zone.create({
      data: {
        locationId,
        name,
        code,
        isLockable: isLockable ?? true,
      },
      include: { location: true },
    });

    const result = {
      id: zone.id,
      name: zone.name,
      code: zone.code,
      isLockable: zone.isLockable,
      locationId: zone.locationId,
      locationName: zone.location?.siteName || "-", // FIXED
    };

    res.json(result);
  } catch (e) {
    console.error("ZONE CREATE ERROR:", e);
    res.status(500).json({ message: "Failed to create zone" });
  }
});

export default router;
