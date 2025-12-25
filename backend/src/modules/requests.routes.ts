import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/* =========================================================
   GET ALL REQUESTS
========================================================= */
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const requests = await prisma.accessRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        location: true,
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
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      requestType,
      locationId,
      requestorName,
      requestorEmail,
      requestorPhone,
      requestorCompany,
    } = req.body;

    if (!locationId) {
      return res.status(400).json({ message: "Location is required" });
    }

    const request = await prisma.accessRequest.create({
      data: {
        requestNo: "REQ-" + Date.now(),
        requestType,
        locationId,
        requestorName,
        requestorEmail,
        requestorPhone,
        requestorCompany,
        startAt: new Date(),
        endAt: new Date(),
      },
      include: {
        location: true,
      },
    });

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create request" });
  }
});

/* =========================================================
   UPDATE DRAFT REQUEST
========================================================= */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.accessRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (existing.status !== "DRAFT") {
      return res.status(400).json({
        message: "Request is locked and cannot be edited after submission",
      });
    }

    const updated = await prisma.accessRequest.update({
      where: { id },
      data: req.body,
      include: {
        location: true,
        visitors: true,
        materials: true,
        attachments: true,
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
      include: {
        visitors: true,
        materials: true,
        attachments: true,
      },
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

    if (request.visitors.length < 1) {
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
