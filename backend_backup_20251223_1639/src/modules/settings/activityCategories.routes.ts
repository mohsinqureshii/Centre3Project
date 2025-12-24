import { Router } from "express";
import prisma from "../../prisma.js";


const router = Router();

/**
 * GET /api/settings/activity-categories
 */
router.get("/", async (_req, res) => {
  try {
    const categories = await prisma.activityCategory.findMany({
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activity categories" });
  }
});

/**
 * POST /api/settings/activity-categories
 */
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const category = await prisma.activityCategory.create({
      data: { name },
    });

    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create activity category" });
  }
});

export default router;
