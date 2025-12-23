import prisma from "../../prisma.js";
import { Request, Response } from "express";

/**
 * PATCH /api/requests/:id
 * Update draft request
 */
export async function updateRequestDraft(req: Request, res: Response) {
  const id = String(req.params.id);
  const body = req.body || {};

  try {
    const existing = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true, materials: true, attachments: true },
    });

    if (!existing) {
      return res.status(404).json({ message: "Request not found" });
    }

    // 🚨 HARD LOCK — BRD ENFORCEMENT
    if (existing.status !== "DRAFT") {
      return res.status(409).json({
        message: "Submitted requests cannot be modified",
      });
    }

    // Update main request fields
    const updated = await prisma.accessRequest.update({
      where: { id },
      data: {
        requestorDepartment: body.requestorDepartment ?? undefined,
        vip: body.vip ?? undefined,
        purpose: body.purpose ?? undefined,
        comments: body.comments ?? undefined,
        zoneId: body.zoneId ?? undefined,
        roomId: body.roomId ?? undefined,
        startAt: body.startAt ? new Date(body.startAt) : undefined,
        endAt: body.endAt ? new Date(body.endAt) : undefined,
      },
    });

    // Replace visitors if provided
    if (Array.isArray(body.visitors)) {
      await prisma.requestVisitor.deleteMany({ where: { requestId: id } });

      if (body.visitors.length > 0) {
        await prisma.requestVisitor.createMany({
          data: body.visitors.map((v: any) => ({
            requestId: id,
            fullName: v.fullName,
            nationality: v.nationality,
            idNumber: v.idNumber,
            company: v.company,
            jobTitle: v.jobTitle ?? null,
            phone: v.mobile,
            email: v.email ?? null,
          })),
        });
      }
    }

    // Replace materials if provided (MVP)
    if (Array.isArray(body.materials)) {
      await prisma.materialItem.deleteMany({ where: { requestId: id } });

      if (body.materials.length > 0) {
        await prisma.materialItem.createMany({
          data: body.materials.map((m: any) => ({
            requestId: id,
            movementType: m.movementType,
            description: m.description,
            quantity: m.quantity,
            reason: m.reason ?? null,
            cabinetRack: m.cabinetRack ?? null,
          })),
        });
      }
    }

    const full = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true, materials: true, attachments: true },
    });

    res.json(full);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to update request", error: err.message });
  }
}

/**
 * POST /api/requests/:id/submit
 * Final validation + submit
 */
export async function submitRequestWithValidation(req: Request, res: Response) {
  const id = String(req.params.id);

  try {
    const r = await prisma.accessRequest.findUnique({
      where: { id },
      include: {
        visitors: true,
        materials: true,
        attachments: true,
      },
    });

    if (!r) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (r.status !== "DRAFT") {
      return res.status(409).json({ message: "Only draft requests can be submitted" });
    }

    // ===============================
    // FINAL VALIDATIONS (MODULE-3)
    // ===============================

    // 1️⃣ Visitors mandatory
    if (!r.visitors || r.visitors.length === 0) {
      return res.status(400).json({ message: "At least one visitor is required" });
    }

    // 2️⃣ Duration limits
    const durationMs = r.endAt.getTime() - r.startAt.getTime();
    const days = durationMs / (1000 * 60 * 60 * 24);

    if (r.requestType === "TEMPORARY_ENTRY_PERMISSION" && days > 180) {
      return res.status(400).json({ message: "TEP cannot exceed 6 months" });
    }

    if (
      ["WORK_PERMIT", "METHOD_OF_PROCEDURE", "MATERIAL_VEHICLE_PERMIT"].includes(
        r.requestType
      ) &&
      days > 14
    ) {
      return res.status(400).json({ message: "Request duration exceeds limit" });
    }

    // 3️⃣ MVP requires materials
    if (
      r.requestType === "MATERIAL_VEHICLE_PERMIT" &&
      (!r.materials || r.materials.length === 0)
    ) {
      return res.status(400).json({ message: "At least one material is required" });
    }

    // 4️⃣ Required attachments per type
    const requiredAttachmentByType: Record<string, string> = {
      ADMIN_VISIT: "VISITOR_ID",
      TEMPORARY_ENTRY_PERMISSION: "VISITOR_ID",
      WORK_PERMIT: "WP_DOC",
      METHOD_OF_PROCEDURE: "MOP_DOC",
      MATERIAL_VEHICLE_PERMIT: "GATE_PASS",
    };

    const requiredType = requiredAttachmentByType[r.requestType];
    if (requiredType) {
      const has = r.attachments.some((a) => a.type === requiredType);
      if (!has) {
        return res.status(400).json({
          message: `Missing required attachment: ${requiredType}`,
        });
      }
    }

    // ✅ SUBMIT
    const updated = await prisma.accessRequest.update({
      where: { id },
      data: { status: "SUBMITTED" },
    });

    res.json({ ok: true, requestId: id, status: updated.status });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Submit failed", error: err.message });
  }
}
