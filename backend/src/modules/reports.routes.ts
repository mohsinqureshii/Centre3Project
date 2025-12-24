import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (_req, res) => {
  const data = await prisma.accessRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(data);
});

export default router;
