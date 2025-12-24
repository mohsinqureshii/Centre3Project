import { Router } from "express";
import prisma from "../../prisma.js";


const router = Router();

/**
 * GET /api/settings/locations
 */
router.get("/", async (_req, res) => {
  try {
    const locations = await prisma.location.findMany({
      where: { isActive: true },
      orderBy: { siteName: "asc" },
    });

    res.json(locations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch locations" });
  }
});

/**
 * POST /api/settings/locations
 */
router.post("/", async (req, res) => {
  try {
    const { country, region, city, siteCode, siteName } = req.body;

    if (!country || !region || !city || !siteCode || !siteName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const location = await prisma.location.create({
      data: { country, region, city, siteCode, siteName },
    });

    res.status(201).json(location);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create location" });
  }
});

export default router;
