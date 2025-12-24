import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * GET /api/credentials
 * Returns list of all credentials, ordered by issuedAt
 */
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const list = await prisma.credential.findMany({
      orderBy: { issuedAt: "desc" }, // ✅ Correct field
    });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load credentials" });
  }
});

export default router;
