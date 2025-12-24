import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import prisma from "../../prisma.js";
import { generateRequestNo } from "../utils/generateRequestNo.js";

export const requestsRouter = Router();

/**
 * Create Draft
 * POST /api/requests
 */
requestsRouter.post("/", authMiddleware, async (req, res) => {
  const schema = z.object({
    requestType: z.string().min(1),
    locationId: z.string().uuid(),
    requestorName: z.string().min(1),
    requestorEmail: z.string().email(),
    requestorPhone: z.string().min(1),
    requestorCompany: z.string().min(1),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  const d = parsed.data;
  const now = new Date();

  try {
    const created = await prisma.accessRequest.create({
      data: {
        requestNo: generateRequestNo("REQ"),
        requestType: d.requestType as any,
        status: "DRAFT",
        requestorName: d.requestorName,
        requestorEmail: d.requestorEmail,
        requestorPhone: d.requestorPhone,
        requestorCompany: d.requestorCompany,
        locationId: d.locationId,
        startAt: now,
        endAt: now,
      },
    });

    return res.json(created);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

/**
 * Update Draft (partial updates)
 * PATCH /api/requests/:id
 */
requestsRouter.patch("/:id", authMiddleware, async (req, res) => {
  const id = String(req.params.id);

  const schema = z
    .object({
      requestorIdNumber: z.string().optional(),
      requestorNationality: z.string().optional(),
      requestorDepartment: z.string().optional(),

      vip: z.boolean().optional(),
      purpose: z.string().optional(),
      comments: z.string().optional(),

      locationId: z.string().uuid().optional(),
      zoneId: z.string().uuid().nullable().optional(),
      roomId: z.string().uuid().nullable().optional(),

      startAt: z.string().datetime().optional(),
      endAt: z.string().datetime().optional(),

      visitors: z
        .array(
          z.object({
            idNumber: z.string().min(1),
            nationality: z.string().min(1),
            fullName: z.string().min(1),
            company: z.string().min(1),
            jobTitle: z.string().optional(),
            email: z.string().email().optional(),
            mobile: z.string().min(1), // frontend sends mobile
            idType: z.string().optional(),
          })
        )
        .optional(),

      materials: z
        .array(
          z.object({
            movementType: z.string().min(1),
            description: z.string().min(1),
            partNumber: z.string().optional(),
            serialNo: z.string().optional(),
            quantity: z.number().int().min(1),
            cabinetRack: z.string().optional(),
            reason: z.string().optional(),
          })
        )
        .optional(),

      formData: z.any().optional(),
    })
    .strict(false);

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  try {
    const existing = await prisma.accessRequest.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Request not found" });

    // update main request fields
    const updateData: any = {};

    const b = parsed.data;

    if (b.requestorIdNumber !== undefined) updateData.requestorIdNumber = b.requestorIdNumber;
    if (b.requestorNationality !== undefined) updateData.requestorNationality = b.requestorNationality;
    if (b.requestorDepartment !== undefined) updateData.requestorDepartment = b.requestorDepartment;

    if (b.vip !== undefined) updateData.vip = b.vip;
    if (b.purpose !== undefined) updateData.purpose = b.purpose;
    if (b.comments !== undefined) updateData.comments = b.comments;

    if (b.locationId !== undefined) updateData.locationId = b.locationId;
    if (b.zoneId !== undefined) updateData.zoneId = b.zoneId;
    if (b.roomId !== undefined) updateData.roomId = b.roomId;

    if (b.startAt !== undefined) updateData.startAt = new Date(b.startAt);
    if (b.endAt !== undefined) updateData.endAt = new Date(b.endAt);

    // Save main draft
    await prisma.accessRequest.update({
      where: { id },
      data: updateData,
    });

    // Visitors (IMPORTANT FIX):
    // Prisma model expects "phone" field, and DOES NOT have verificationStatus
    if (b.visitors) {
      await prisma.requestVisitor.deleteMany({ where: { requestId: id } });

      await prisma.requestVisitor.createMany({
        data: b.visitors.map((v) => ({
          requestId: id,
          idNumber: v.idNumber,
          nationality: v.nationality,
          fullName: v.fullName,
          company: v.company,
          jobTitle: v.jobTitle ?? null,
          email: v.email ?? null,
          idType: v.idType ?? null,
          phone: v.mobile, // ✅ mobile -> phone mapping
        })),
      });
    }

    // Materials (MVP only; safe no-op otherwise)
    if (b.materials) {
      await prisma.materialItem.deleteMany({ where: { requestId: id } });
      await prisma.materialItem.createMany({
        data: b.materials.map((m) => ({
          requestId: id,
          movementType: m.movementType,
          description: m.description,
          partNumber: m.partNumber ?? null,
          serialNo: m.serialNo ?? null,
          quantity: m.quantity,
          cabinetRack: m.cabinetRack ?? null,
          reason: m.reason ?? null,
        })),
      });
    }

    const updated = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true, materials: true, attachments: true },
    });

    return res.json(updated);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

/**
 * Submit (validation later - for now just lock)
 * POST /api/requests/:id/submit
 */
requestsRouter.post("/:id/submit", authMiddleware, async (req, res) => {
  const id = String(req.params.id);

  try {
    const existing = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true, attachments: true, materials: true },
    });
    if (!existing) return res.status(404).json({ message: "Request not found" });

    if (existing.status !== "DRAFT") {
      return res.status(400).json({ message: "Only DRAFT requests can be submitted" });
    }

    const updated = await prisma.accessRequest.update({
      where: { id },
      data: { status: "SUBMITTED" },
    });

    return res.json({ ok: true, requestId: id, status: updated.status });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

/**
 * List requests
 * GET /api/requests
 */
requestsRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await prisma.accessRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: { location: true },
    });
    return res.json(items);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

/**
 * Get request by id
 * GET /api/requests/:id
 */
requestsRouter.get("/:id", authMiddleware, async (req, res) => {
  const id = String(req.params.id);
  try {
    const row = await prisma.accessRequest.findUnique({
      where: { id },
      include: { location: true, zone: true, room: true, visitors: true, attachments: true, materials: true },
    });
    if (!row) return res.status(404).json({ message: "Not found" });
    return res.json(row);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});
