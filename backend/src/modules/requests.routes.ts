import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/* =========================================================
   HELPERS
========================================================= */

function generateRequestNo() {
  const d = new Date();
  return `REQ-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function mapVisitType(type?: string) {
  if (!type) return null;

  const map: Record<string, any> = {
    ADMIN: "ADMIN_VISIT",
    ADMIN_VISIT: "ADMIN_VISIT",
    TEMPORARY: "TEMPORARY_ENTRY_PERMISSION",
    WORK: "WORK_PERMIT",
    MOP: "METHOD_OF_PROCEDURE",
    MATERIAL: "MATERIAL_VEHICLE_PERMIT",
  };

  return map[type] ?? null;
}

function combineDateTime(date?: string, time?: string) {
  if (!date || !time) return null;
  return new Date(`${date}T${time}:00`);
}

/* =========================================================
   GET ALL REQUESTS
========================================================= */
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const requests = await prisma.accessRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        location: true,
        zone: true,
        room: true,
        visitors: true,
        materials: true,
        attachments: true,
      },
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load requests" });
  }
});

/* =========================================================
   CREATE DRAFT REQUEST
========================================================= */
router.post("/draft", authMiddleware, async (req, res) => {
  try {
    const data = req.body;

    const startAt = combineDateTime(data.visitDate, data.startTime);
    const endAt = combineDateTime(data.visitDate, data.endTime);

    const draft = await prisma.accessRequest.create({
      data: {
        requestNo: generateRequestNo(),
        status: "DRAFT",

        requestType: mapVisitType(data.visitType),
        purpose: data.purpose ?? null,

        locationId: data.locationId ?? null,
        zoneId: data.zoneId ?? null,
        roomId: data.roomId ?? null,

        startAt,
        endAt,

        requestorName: data.host ?? null,
        requestorCompany: data.company ?? null,

        visitors: data.visitors?.length
          ? {
              create: data.visitors.map((v: any) => ({
                fullName: v.fullName,
                idNumber: v.idNumber,
                company: v.company,
                phone: v.phone,
                email: v.email ?? null,
                nationality: v.nationality ?? "UNKNOWN",
              })),
            }
          : undefined,
      },
      include: {
        location: true,
        zone: true,
        room: true,
        visitors: true,
      },
    });

    res.status(201).json(draft);
  } catch (err) {
    console.error("DRAFT CREATE ERROR:", err);
    res.status(400).json({ message: "Failed to save draft" });
  }
});

/* =========================================================
   UPDATE DRAFT REQUEST
========================================================= */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const existing = await prisma.accessRequest.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (existing.status !== "DRAFT") {
      return res.status(400).json({
        message: "Request cannot be edited after submission",
      });
    }

    const updated = await prisma.accessRequest.update({
      where: { id },
      data: {
        ...data,
        requestType: mapVisitType(data.visitType),
      },
      include: {
        location: true,
        zone: true,
        room: true,
        visitors: true,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request" });
  }
});

/* =========================================================
   SUBMIT REQUEST
========================================================= */
router.post("/:id/submit", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const request = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "DRAFT") {
      return res.status(400).json({ message: "Request already submitted" });
    }

    if (!request.locationId) {
      return res.status(400).json({ message: "Location is required" });
    }

    if (!request.requestType) {
      return res.status(400).json({ message: "Visit type is required" });
    }

    if (!request.startAt || !request.endAt) {
      return res.status(400).json({ message: "Start and end time required" });
    }

    if (request.visitors.length === 0) {
      return res.status(400).json({ message: "At least one visitor required" });
    }

    await prisma.accessRequest.update({
      where: { id },
      data: { status: "SUBMITTED" },
    });

    res.json({ ok: true, status: "SUBMITTED" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to submit request" });
  }
});

export default router;
