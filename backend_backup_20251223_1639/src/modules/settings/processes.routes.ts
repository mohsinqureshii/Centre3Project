import { Router } from "express";
import prisma from "../../prisma.js";


const router = Router();

/**
 * GET /api/settings/processes
 */
router.get("/", async (_req, res) => {
  try {
    const processes = await prisma.processDefinition.findMany({
      where: { isActive: true },
      include: { stages: true },
      orderBy: { name: "asc" },
    });

    res.json(processes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch processes" });
  }
});

/**
 * POST /api/settings/processes
 */
router.post("/", async (req, res) => {
  try {
    const { name, requestType } = req.body;

    if (!name || !requestType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const process = await prisma.processDefinition.create({
      data: { name, requestType },
    });

    res.status(201).json(process);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create process" });
  }
});

export default router;
