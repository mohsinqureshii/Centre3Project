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
      include: { location: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(zones);
  } 
  
catch (e) {
  console.error("ZONE ERROR:", e);
  return res.status(500).json({
    message: "Failed to create zone",
    error: String(e),
  });
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
    });

    res.json(zone);
  } catch (e) {
    res.status(500).json({ message: "Failed to create zone" });
  }
});

export default router;
