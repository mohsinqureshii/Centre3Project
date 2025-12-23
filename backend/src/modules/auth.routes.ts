import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * DEV AUTH ENDPOINT
 * (Real JWT will come later)
 */
router.post("/login", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  // DEV TOKEN (mock)
  res.json({
    token: "DEV_TOKEN",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  res.json({ user: (req as any).user });
});

export default router;
