import { Router } from "express";
import prisma from "../prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user)
    return res.status(401).json({ message: "Invalid email or password" });

  const valid = await bcrypt.compare(password, user.passwordHash);

  if (!valid)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
});

export default router;
