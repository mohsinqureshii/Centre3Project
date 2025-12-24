import { Router } from "express";
import prisma from "../../prisma.js";

const roomsRouter = Router();

/* =====================================================
   GET ROOMS
===================================================== */
roomsRouter.get("/", async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: "asc" },
      include: {
        zone: true,
        location: true,
      },
    });

    res.json(rooms);
  } catch (err) {
    console.error("GET /rooms failed", err);
    res.status(500).json({ message: "Failed to load rooms" });
  }
});

/* =====================================================
   CREATE ROOM
===================================================== */
roomsRouter.post("/", async (req, res) => {
  try {
    const { zoneId, locationId, name, code } = req.body;

    if (!zoneId || !locationId || !name) {
      return res.status(400).json({
        message: "zoneId, locationId and name are required",
      });
    }

    // Validate zone
    const zone = await prisma.zone.findFirst({
      where: { id: zoneId },
    });

    if (!zone) {
      return res.status(400).json({ message: "Invalid zone" });
    }

    // Validate location
    const location = await prisma.location.findFirst({
      where: { id: locationId },
    });

    if (!location) {
      return res.status(400).json({ message: "Invalid location" });
    }

    const room = await prisma.room.create({
      data: {
        zoneId,
        locationId,
        name,
        code: code || null,
      },
      include: {
        zone: true,
        location: true,
      },
    });

    res.status(201).json(room);
  } catch (err) {
    console.error("POST /rooms failed", err);
    res.status(500).json({ message: "Failed to create room" });
  }
});

export default roomsRouter;
