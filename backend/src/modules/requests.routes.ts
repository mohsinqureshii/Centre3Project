import { Router } from "express";
import prisma from "../prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { z } from "zod";

const router = Router();

/* =========================================================
   HELPERS
========================================================= */

function daysBetween(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
}

function submissionError(res: any, errors: string[]) {
  return res.status(400).json({
    message: "Cannot submit request",
    errors,
  });
}

/* =========================================================
   CREATE REQUEST (DRAFT)
========================================================= */

router.post("/", authMiddleware, async (req, res) => {
  const {
    requestType,
    locationId,
    requestorName,
    requestorEmail,
    requestorPhone,
    requestorCompany,
  } = req.body;

  const request = await prisma.accessRequest.create({
    data: {
      requestType,
      locationId,
      requestorName,
      requestorEmail,
      requestorPhone,
      requestorCompany,
      startAt: new Date(),
      endAt: new Date(),
    },
  });

  res.json(request);
});

/* =========================================================
   UPDATE REQUEST (ONLY IF DRAFT)
========================================================= */

router.patch("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.accessRequest.findUnique({
    where: { id },
  });

  if (!existing) {
    return res.status(404).json({ message: "Request not found" });
  }

  if (existing.status !== "DRAFT") {
    return res
      .status(400)
      .json({ message: "Request is locked and cannot be edited after submission" });
  }

  const updated = await prisma.accessRequest.update({
    where: { id },
    data: req.body,
    include: {
      visitors: true,
      materials: true,
      attachments: true,
    },
  });

  res.json(updated);
});

/* =========================================================
   GET ALL REQUESTS
========================================================= */

router.get("/", authMiddleware, async (_req, res) => {
  const requests = await prisma.accessRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json(requests);
});

/* =========================================================
   SUBMIT REQUEST (FINAL VALIDATION)
========================================================= */

router.post("/:id/submit", authMiddleware, async (req, res) => {
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
    return res
      .status(400)
      .json({ message: "Request already submitted" });
  }

  const errors: string[] = [];

  /* -------------------------
     BASIC REQUIRED FIELDS
  ------------------------- */
  if (!request.locationId) errors.push("Location is required");
  if (!request.startAt || !request.endAt)
    errors.push("Start and end date are required");

  /* -------------------------
     DURATION RULES
  ------------------------- */
  const durationDays = daysBetween(request.startAt, request.endAt);

  if (
    request.requestType === "TEMPORARY_ENTRY_PERMISSION" &&
    durationDays > 183
  ) {
    errors.push("Temporary Entry Permission cannot exceed 6 months");
  }

  if (
    ["WORK_PERMIT", "METHOD_OF_PROCEDURE", "MATERIAL_VEHICLE_PERMIT"].includes(
      request.requestType
    ) &&
    durationDays > 14
  ) {
    errors.push("This request type cannot exceed 14 days");
  }

  /* -------------------------
     REQUIRED ROWS
  ------------------------- */
  if (request.visitors.length < 1) {
    errors.push("At least one visitor is required");
  }

  if (
    ["WORK_PERMIT", "METHOD_OF_PROCEDURE", "MATERIAL_VEHICLE_PERMIT"].includes(
      request.requestType
    ) &&
    request.materials.length < 1
  ) {
    errors.push("At least one material item is required");
  }

  /* -------------------------
     REQUIRED ATTACHMENTS (STUB)
  ------------------------- */
  if (
    ["WORK_PERMIT", "METHOD_OF_PROCEDURE"].includes(request.requestType) &&
    request.attachments.length < 1
  ) {
    errors.push("Required documents must be attached");
  }

  /* -------------------------
     FINAL DECISION
  ------------------------- */
  if (errors.length > 0) {
    return submissionError(res, errors);
  }

  await prisma.accessRequest.update({
    where: { id },
    data: {
      status: "SUBMITTED",
    },
  });

  res.json({
    ok: true,
    requestId: id,
    status: "SUBMITTED",
  });
});

export default router;
