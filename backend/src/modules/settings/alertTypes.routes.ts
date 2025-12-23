import { Router } from "express";
import prisma from "../../prisma.js";

const router = Router();

/**
 * GET /api/settings/alert-types
 */
router.get("/", async (_req, res) => {
  try {
    const alertTypes = await prisma.alertType.findMany({
      orderBy: { name: "asc" },
    });

    res.json(alertTypes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch alert types" });
  }
});

/**
 * POST /api/settings/alert-types
 */
router.post("/", async (req, res) => {
  try {
    const { name, severity } = req.body;

    if (!name || !severity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const alertType = await prisma.alertType.create({
      data: { name, severity },
    });

    res.status(201).json(alertType);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create alert type" });
  }
});

export default router;
