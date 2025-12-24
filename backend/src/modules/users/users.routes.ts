import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
  const { fullName, email, passwordHash, phone, role } = req.body;

  const user = await prisma.user.create({
    data: { fullName, email, passwordHash, phone, role },
  });

  res.json(user);
});

export default router;
