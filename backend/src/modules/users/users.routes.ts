import { Router } from "express";
import prisma from "../../prisma.js";


export const usersRouter = Router();

/* =========================
   GET ALL USERS
========================= */
usersRouter.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });
  res.json(users);
});

/* =========================
   CREATE USER
========================= */
usersRouter.post("/", async (req, res) => {
  const {
    fullName,
    email,
    phone,
    role,
    userType,
    department,
    functionName,
    zone,
    expiry,
    tempPassword,
  } = req.body;

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      phone,
      role,
      userType,
      department,
      functionName,
      zone,
      expiry: expiry ? new Date(expiry) : null,
      passwordHash: tempPassword || "admin123",
      isActive: true,
    },
  });

  res.json(user);
});

/* =========================
   UPDATE USER (EDIT)
========================= */
usersRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });

  res.json(user);
});

/* =========================
   ACTIVATE / DEACTIVATE
========================= */
usersRouter.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: { isActive },
  });

  res.json(user);
});
