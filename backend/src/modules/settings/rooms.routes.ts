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
  } 

catch (e) {
  console.error("ROOM ERROR:", e);
  return res.status(500).json({
    message: "Failed to load rooms",
    error: String(e),
  });
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
  } 
  
catch (e) {
  console.error("ROOM ERROR:", e);
  return res.status(500).json({
    message: "Failed to load rooms",
    error: String(e),
  });
}



});

export default roomsRouter;
