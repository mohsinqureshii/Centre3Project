import { Router } from "express";
import prisma from "../../prisma.js";


const router = Router();

/**
 * GET /api/settings/activities
 */
router.get("/", async (_req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: { isActive: true },
      include: {
        category: true,
        defaultProcess: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
});

/**
 * POST /api/settings/activities
 */
router.post("/", async (req, res) => {
  try {
    const {
      name,
      categoryId,
      riskLevel,
      defaultProcessId,
    } = req.body;

    if (!name || !categoryId || !riskLevel) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        categoryId,
        riskLevel,
        defaultProcessId,
      },
    });

    res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create activity" });
  }
});

export default router;
