import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authMiddleware, async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(users);
});

router.post("/", authMiddleware, async (req, res) => {
  const { fullName, email, passwordHash, role, phone } = req.body;

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      role,
      phone,
    },
  });

  res.json(user);
});

export default router;
