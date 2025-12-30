import { Router } from "express";
import prisma from "../../prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import bcrypt from "bcrypt";

const router = Router();

/* =========================
   GET ALL USERS
========================= */
router.get("/", authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
       userCode: true, 
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.json(users);
});

/* =========================
   CREATE USER
========================= */
router.post("/", authMiddleware, async (req, res) => {
  const {
    fullName,
    email,
    phone,
    role,
    tempPassword,
  } = req.body;

  if (!tempPassword) {
    return res.status(400).json({ message: "Password is required" });
  }

  const passwordHash = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      role,
      passwordHash,
      isActive: true,
    },
  });

  res.status(201).json(user);
});

/* =========================
   ACTIVATE / DEACTIVATE USER
========================= */
router.patch("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be true or false" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });

  res.json(user);
});

router.post("/:id/status", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be true or false" });
  }

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });

  res.json(user);
});

/* =========================
   UPDATE USER (EDIT)
========================= */
router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const {
    fullName,
    phone,
    role,
    userType,
    functionName,
    zone,
    expiry,
  } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      fullName,
      phone,
      role,
      userType,
    },
  });

  res.json(user);
});

/* ===== SUPPORT POST + _method ===== */
router.post("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const {
    fullName,
    phone,
    role,
    userType,
  } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      fullName,
      phone,
      role,
      userType,

    },
  });

  res.json(user);
});

export default router;

