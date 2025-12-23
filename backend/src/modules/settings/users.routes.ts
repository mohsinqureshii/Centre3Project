import { Router } from "express";
import prisma from "../../prisma.js";
import crypto from "crypto";

const router = Router();

/**
 * GET /api/settings/users
 */
router.get("/", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { fullName: "asc" },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

/**
 * POST /api/settings/users
 */
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      role,
      department,
      userType,
      expiryAt,
    } = req.body;

    if (!fullName || !email || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userCode = crypto.randomInt(1000, 9999).toString();

    const user = await prisma.user.create({
      data: {
        userCode,
        fullName,
        email,
        phone,
        role,
        department,
        userType,
        expiryAt,
        passwordHash: "TEMP",
      },
    });

    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create user" });
  }
});

/**
 * PATCH /api/settings/users/:id/status
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user status" });
  }
});

export default router;
