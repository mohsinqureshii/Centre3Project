// backend/modules/settings/activities.routes.ts

import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/settings/activities
 * --------------------------------------------
 * Your Prisma schema for Activity:
 *
 * model Activity {
 *    id               String
 *    categoryId       String
 *    name             String
 *    riskLevel        String
 *    defaultProcessId String?
 * }
 *
 * NO `isActive` field exists.
 * NO nested relations need to be included.
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { name: "asc" }
    });

    res.json(activities);
  } catch (err) {
    console.error("Error loading activities:", err);
    res.status(500).json({ message: "Failed to load activities" });
  }
});

/**
 * POST /api/settings/activities
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { categoryId, name, riskLevel, defaultProcessId } = req.body;

    if (!categoryId || !name || !riskLevel) {
      return res
        .status(400)
        .json({ message: "categoryId, name, and riskLevel are required" });
    }

    const activity = await prisma.activity.create({
      data: {
        categoryId,
        name,
        riskLevel,
        defaultProcessId: defaultProcessId || null,
      },
    });

    res.status(201).json(activity);
  } catch (err) {
    console.error("Error creating activity:", err);
    res.status(500).json({ message: "Failed to create activity" });
  }
});

export default router;
