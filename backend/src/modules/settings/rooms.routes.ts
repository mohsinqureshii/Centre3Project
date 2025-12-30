// import { Router } from "express";
// import prisma from "../../prisma.js";

// const roomsRouter = Router();

// /* =====================================================
//    GET ROOMS
// ===================================================== */
// roomsRouter.get("/", async (req, res) => {
//   try {
//     const rooms = await prisma.room.findMany({
//       orderBy: { name: "asc" },
// select: {
//     id: true,
//     name: true,
//     code: true,
//     zone: { select: { name: true } },
//     location: { select: { siteName: true } },
//   },
//     });


// const formattedRooms = rooms.map(r => ({
//   ...r,
//   zoneName: r.zone?.name,
//   locationName: r.location?.siteName
// }));

// res.json(formattedRooms);
//   } 

// catch (e) {
//   console.error("ROOM ERROR:", e);
//   return res.status(500).json({
//     message: "Failed to load rooms",
//     error: String(e),
//   });
// }



// });

// /* =====================================================
//    CREATE ROOM
// ===================================================== */
// roomsRouter.post("/", async (req, res) => {
//   try {
//     const { zoneId, locationId, name, code } = req.body;

//     if (!zoneId || !locationId || !name) {
//       return res.status(400).json({
//         message: "zoneId, locationId and name are required",
//       });
//     }

//     // Validate zone
//     const zone = await prisma.zone.findFirst({
//       where: { id: zoneId },
//     });

//     if (!zone) {
//       return res.status(400).json({ message: "Invalid zone" });
//     }

//     // Validate location
//     const location = await prisma.location.findFirst({
//       where: { id: locationId },
//     });

//     if (!location) {
//       return res.status(400).json({ message: "Invalid location" });
//     }

//     const room = await prisma.room.create({
//       data: {
//         zoneId,
//         locationId,
//         name,
//         code: code || null,
//       },
//       include: {
//         zone: true,
//         location: true,
//       },
//     });

//     res.status(201).json(room);
//   } 
  
// catch (e) {
//   console.error("ROOM ERROR:", e);
//   return res.status(500).json({
//     message: "Failed to load rooms",
//     error: String(e),
//   });
// }



// });

// export default roomsRouter;

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
        zone: { select: { name: true } },
        location: { select: { siteName: true } }, // use 'name' if your schema is 'name'
      },
    });

    // Map names for frontend convenience
    const formattedRooms = rooms.map((r) => ({
      id: r.id,
      name: r.name,
      code: r.code,
      zoneId: r.zoneId,
      locationId: r.locationId,
      zoneName: r.zone?.name || "-",
      locationName: r.location?.siteName || "-",
    }));

    res.json(formattedRooms);
  } catch (e) {
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
    const zone = await prisma.zone.findFirst({ where: { id: zoneId } });
    if (!zone) return res.status(400).json({ message: "Invalid zone" });

    // Validate location
    const location = await prisma.location.findFirst({ where: { id: locationId } });
    if (!location) return res.status(400).json({ message: "Invalid location" });

    // Create room
    const room = await prisma.room.create({
      data: {
        zoneId,
        locationId,
        name,
        code: code || null,
      },
      include: {
        zone: { select: { name: true } },
        location: { select: { siteName: true } }, // or 'name'
      },
    });

    // Map names for frontend
    const formattedRoom = {
      id: room.id,
      name: room.name,
      code: room.code,
      zoneId: room.zoneId,
      locationId: room.locationId,
      zoneName: room.zone?.name || "-",
      locationName: room.location?.siteName || "-",
    };

    res.status(201).json(formattedRoom);
  } catch (e) {
    console.error("ROOM ERROR:", e);
    return res.status(500).json({
      message: "Failed to create room",
      error: String(e),
    });
  }
});

export default roomsRouter;
