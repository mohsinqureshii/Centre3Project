import type { Request, Response } from "express";
import { z } from "zod";
import prisma from "../../prisma.js";

/**
 * IMPORTANT NOTE (Phase-1 scope):
 * Your DB model currently has a SINGLE `requestType` field (not an array),
 * so "WP + MOP + MVP together" cannot be represented as multiple types in one record.
 *
 * What we CAN enforce now:
 * - requestType must be a valid enum value
 * - TEP is exclusive by nature (single type)
 * - strict lifecycle rules: only DRAFT/RETURNED are editable
 * - strict submit validation and attachment enforcement
 *
 * If you want true multi-select types, we will add it in Phase-3/Phase-4 via schema change:
 * requestCategory + requestSubTypes[] (stored in JSON or join table) + approval mapping.
 */

const RequestTypeEnum = z.enum([
  "ADMIN_VISIT",
  "TEMPORARY_ENTRY_PERMISSION",
  "WORK_PERMIT",
  "METHOD_OF_PROCEDURE",
  "MATERIAL_VEHICLE_PERMIT",
]);

const EditableStatusEnum = z.enum(["DRAFT", "RETURNED"]);

const PatchBodySchema = z
  .object({
    // Core / global
    requestType: RequestTypeEnum.optional(),

    // Requestor (global)
    requestorName: z.string().min(1).optional(),
    requestorEmail: z.string().email().optional(),
    requestorPhone: z.string().min(1).optional(),
    requestorCompany: z.string().min(1).optional(),

    // Optional extended requestor fields (stored in formData.requestor if present)
    requestorIdNumber: z.string().min(1).optional(),
    requestorNationality: z.string().min(1).optional(),
    requestorDepartmentOrCustomer: z.string().min(1).optional(),

    // Location/scope
    locationId: z.string().uuid().optional(),
    zoneId: z.string().uuid().nullable().optional(),
    roomId: z.string().uuid().nullable().optional(),

    // Schedule
    startAt: z.coerce.date().optional(),
    endAt: z.coerce.date().optional(),

    // Flags used by approval context
    vip: z.boolean().optional(),
    riskLevel: z.string().optional(), // keep flexible for now
    movementType: z.string().optional(), // keep flexible for now

    // JSON payloads
    formData: z.any().optional(), // request-type specific payload
    meta: z.any().optional(), // misc

    // Visitors
    visitors: z
      .array(
        z.object({
          idNumber: z.string().min(1),
          nationality: z.string().min(1),
          fullName: z.string().min(1),
          company: z.string().min(1),
          jobTitle: z.string().optional().nullable(),
          mobileNumber: z.string().min(1),
          email: z.string().email().optional().nullable(),

          // Optional: allow existing fields without breaking
          idType: z.string().optional().nullable(),
          idExpiryDate: z.string().optional().nullable(),
          verificationStatus: z.string().optional().nullable(),
          verificationProvider: z.string().optional().nullable(),
          verificationTimestamp: z.string().optional().nullable(),
        })
      )
      .optional(),

    // MVP materials
    materials: z
      .array(
        z.object({
          description: z.string().min(1),
          quantity: z.union([z.number(), z.string()]),
          reason: z.string().min(1),
        })
      )
      .optional(),
  })
  .strict();

function minutesBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / (60 * 1000));
}

function assertEditable(status: string) {
  const ok = EditableStatusEnum.safeParse(status).success;
  if (!ok) throw new Error("Request is locked and cannot be edited");
}

function assertDateLogic(startAt?: Date, endAt?: Date) {
  if (!startAt || !endAt) return;
  if (endAt.getTime() <= startAt.getTime()) {
    throw new Error("End date/time must be after start date/time");
  }
}

function assertDurationByType(type: z.infer<typeof RequestTypeEnum>, startAt: Date, endAt: Date) {
  const mins = minutesBetween(startAt, endAt);
  const days = mins / (60 * 24);

  // BRD duration limits
  // TEP: 6 months (approx 183 days)
  // WP/MOP/MVP: 2 weeks (14 days)
  // Admin Visit: configurable (Phase-1: allow 14 days default; we’ll make configurable later)
  if (type === "TEMPORARY_ENTRY_PERMISSION" && days > 183) {
    throw new Error("TEP cannot exceed 6 months");
  }
  if (type === "WORK_PERMIT" && days > 14) {
    throw new Error("Work Permit cannot exceed 2 weeks");
  }
  if (type === "METHOD_OF_PROCEDURE" && days > 14) {
    throw new Error("MOP cannot exceed 2 weeks");
  }
  if (type === "MATERIAL_VEHICLE_PERMIT" && days > 14) {
    throw new Error("MVP cannot exceed 2 weeks");
  }
  if (type === "ADMIN_VISIT" && days > 14) {
    throw new Error("Admin Visit cannot exceed 2 weeks (configurable later)");
  }
}

async function assertLocationScope(locationId: string, zoneId?: string | null, roomId?: string | null) {
  const loc = await prisma.location.findUnique({ where: { id: locationId } });
  if (!loc) throw new Error("Invalid locationId");
  if ((loc as any).isActive === false) throw new Error("Selected site/location is inactive");

  if (zoneId) {
    const zRow = await prisma.zone.findUnique({ where: { id: zoneId } });
    if (!zRow) throw new Error("Invalid zoneId");
    if (zRow.locationId !== locationId) throw new Error("Zone does not belong to selected location");
    if ((zRow as any).isActive === false) throw new Error("Selected zone is inactive");
  }

  if (roomId) {
    const rRow = await prisma.room.findUnique({ where: { id: roomId } });
    if (!rRow) throw new Error("Invalid roomId");
    if (rRow.locationId !== locationId) throw new Error("Room does not belong to selected location");
    if (zoneId && rRow.zoneId !== zoneId) throw new Error("Room does not belong to selected zone");
  }
}

async function enforceRequiredAttachments(requestId: string, requestType: z.infer<typeof RequestTypeEnum>) {
  const requiredTypes: string[] = [];

  // BRD strict rules (Phase-1 mapping to your schema types)
  // You already enforce WP_DOC / MOP_DOC / MVP_DOC-ish in existing logic; keep it stable.
  if (requestType === "METHOD_OF_PROCEDURE") requiredTypes.push("MOP_DOC");
  if (requestType === "WORK_PERMIT") requiredTypes.push("WP_DOC");
  if (requestType === "MATERIAL_VEHICLE_PERMIT") requiredTypes.push("MVP_DOC");
  if (requestType === "ADMIN_VISIT") requiredTypes.push("VISITOR_IDS");
  if (requestType === "TEMPORARY_ENTRY_PERMISSION") requiredTypes.push("VISITOR_IDS");

  if (requiredTypes.length === 0) return;

  const attachments = await prisma.attachment.findMany({
    where: { requestId },
    select: { type: true },
  });

  const have = new Set(attachments.map((a) => a.type));
  const missing = requiredTypes.filter((t) => !have.has(t));

  if (missing.length) {
    throw new Error(`Missing required attachments: ${missing.join(", ")}`);
  }
}

function validateVisitors(visitors: any[], requestEndAt?: Date) {
  if (!Array.isArray(visitors) || visitors.length < 1) {
    throw new Error("At least 1 visitor is required");
  }

  const ids = new Set<string>();
  for (const v of visitors) {
    if (ids.has(v.idNumber)) throw new Error("Visitor ID Number must be unique within the request");
    ids.add(v.idNumber);

    // If expiry provided, warn/block is policy-based. Phase-1: BLOCK when clearly invalid vs endAt.
    if (v.idExpiryDate && requestEndAt) {
      const exp = new Date(v.idExpiryDate);
      if (!Number.isNaN(exp.getTime()) && exp.getTime() < requestEndAt.getTime()) {
        throw new Error(`Visitor ID expiry is before request end date for ID: ${v.idNumber}`);
      }
    }
  }
}

function validateWorkPermit(formData: any) {
  // Minimal Phase-1 structural validation
  const ms = formData?.methodStatement;
  const risks = formData?.risks;
  if (!Array.isArray(ms) || ms.length < 1) throw new Error("Work Permit requires at least 1 Method Statement step");
  if (!Array.isArray(risks) || risks.length < 1) throw new Error("Work Permit requires at least 1 Risk entry");
}

function validateMop(formData: any) {
  // Minimal Phase-1 structural validation
  const steps = formData?.implementationSteps;
  const participants = formData?.participants;
  if (!Array.isArray(steps) || steps.length < 1) throw new Error("MOP requires at least 1 Implementation Step");
  if (!Array.isArray(participants) || participants.length < 1) throw new Error("MOP requires at least 1 Participant");
}

function validateMvp(formData: any, materials: any[]) {
  // Minimal Phase-1 structural validation
  if (!Array.isArray(materials) || materials.length < 1) {
    throw new Error("MVP requires at least 1 material item");
  }

  const withVehicle = formData?.withVehicle;
  const direction = formData?.direction; // entry/exit/both
  if (typeof withVehicle !== "boolean") throw new Error("MVP requires 'withVehicle' boolean");
  if (!direction) throw new Error("MVP requires movement direction (Entry/Exit/Both)");

  if (withVehicle) {
    const vd = formData?.vehicleDetails;
    if (!vd?.driverName || !vd?.driverId || !vd?.vehiclePlate) {
      throw new Error("Vehicle details are required when MVP is with vehicle");
    }
  }
}

function validateTep(formData: any) {
  if (!formData?.purpose) throw new Error("TEP requires purpose");
  if (!formData?.hostName) throw new Error("TEP requires hostName");
  // Target room required per BRD
  if (!formData?.roomId) throw new Error("TEP requires target room");
}

function validateAdminVisit(formData: any) {
  if (!formData?.purpose) throw new Error("Admin Visit requires purpose");
  if (!formData?.hostName) throw new Error("Admin Visit requires hostName");
  if (formData?.vip === true && !formData?.vipJustification) {
    throw new Error("VIP justification is required when VIP = Yes");
  }
  if (formData?.vehicleEntry === true) {
    const v = formData?.vehicleDetails;
    if (!v?.driverName || !v?.driverId || !v?.vehiclePlate || !v?.company || !v?.mobile) {
      throw new Error("Vehicle entry details are required when Vehicle Entry = Yes");
    }
  }
}

/**
 * PATCH /api/requests/:id
 * Draft-only updates (autosave-friendly).
 */
export async function updateRequestDraft(req: Request, res: Response) {
  try {
    const id = String(req.params.id);
    const parsed = PatchBodySchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });

    const existing = await prisma.accessRequest.findUnique({
      where: { id },
      include: { visitors: true, materials: true },
    });
    if (!existing) return res.status(404).json({ message: "Request not found" });

    assertEditable(existing.status);

    const patch = parsed.data;

    // Date sanity (if both provided or one provided)
    assertDateLogic(patch.startAt ?? existing.startAt ?? undefined, patch.endAt ?? existing.endAt ?? undefined);

    // Normalize formData/meta merge (do not destroy if patch omits)
    const nextFormData =
      patch.formData !== undefined ? patch.formData : (existing.formData ?? null);
    const nextMeta =
      patch.meta !== undefined ? patch.meta : (existing.meta ?? null);

    // Optional: store requestor extras into formData.requestor for consistency (Phase-1 normalized contract)
    let normalizedFormData: any = nextFormData;
    if (patch.requestorIdNumber || patch.requestorNationality || patch.requestorDepartmentOrCustomer) {
      normalizedFormData = normalizedFormData && typeof normalizedFormData === "object" ? normalizedFormData : {};
      normalizedFormData.requestor = {
        ...(normalizedFormData.requestor ?? {}),
        idNumber: patch.requestorIdNumber ?? normalizedFormData.requestor?.idNumber ?? null,
        nationality: patch.requestorNationality ?? normalizedFormData.requestor?.nationality ?? null,
        departmentOrCustomer:
          patch.requestorDepartmentOrCustomer ?? normalizedFormData.requestor?.departmentOrCustomer ?? null,
      };
    }

    // Persist request core fields
    const updated = await prisma.accessRequest.update({
      where: { id },
      data: {
        requestType: patch.requestType ?? (existing.requestType as any),
        requestorName: patch.requestorName ?? existing.requestorName,
        requestorEmail: patch.requestorEmail ?? existing.requestorEmail,
        requestorPhone: patch.requestorPhone ?? existing.requestorPhone,
        requestorCompany: patch.requestorCompany ?? existing.requestorCompany,

        locationId: patch.locationId ?? existing.locationId,
        zoneId: patch.zoneId !== undefined ? patch.zoneId : existing.zoneId,
        roomId: patch.roomId !== undefined ? patch.roomId : (existing as any).roomId ?? null,

        startAt: patch.startAt ?? existing.startAt,
        endAt: patch.endAt ?? existing.endAt,

        vip: patch.vip ?? (existing as any).vip ?? false,
        riskLevel: patch.riskLevel ?? (existing as any).riskLevel ?? null,
        movementType: patch.movementType ?? (existing as any).movementType ?? null,

        formData: normalizedFormData ?? null,
        meta: nextMeta ?? null,
      } as any,
    });

    // Upsert Visitors (if provided)
    if (patch.visitors) {
      await prisma.requestVisitor.deleteMany({ where: { requestId: id } });
      await prisma.requestVisitor.createMany({
        data: patch.visitors.map((v: any) => ({
          requestId: id,
          idNumber: v.idNumber,
          nationality: v.nationality,
          fullName: v.fullName,
          company: v.company,
          mobileNumber: v.mobileNumber,
          jobTitle: v.jobTitle ?? null,
          email: v.email ?? null,
          idType: v.idType ?? null,
          // keep extra fields if schema supports (safe: Prisma will reject unknown columns; so we only store known ones)
        })),
      });
    }

    // MVP Materials (if provided)
    if (patch.materials) {
      await prisma.materialItem.deleteMany({ where: { requestId: id } });
      await prisma.materialItem.createMany({
        data: patch.materials.map((m: any) => ({
          requestId: id,
          description: m.description,
          quantity: typeof m.quantity === "string" ? Number(m.quantity) : m.quantity,
          reason: m.reason,
        })),
      });
    }

    return res.json({ ok: true, requestId: updated.id, status: updated.status });
  } catch (e: any) {
    return res.status(400).json({ message: e?.message ?? "Update failed" });
  }
}

/**
 * POST /api/requests/:id/submit
 * Final validation gate + lock request into Module-4 (approval workflow).
 */
export async function submitRequestWithValidation(req: Request, res: Response) {
  try {
    const id = String(req.params.id);

    const r = await prisma.accessRequest.findUnique({
      where: { id },
      include: {
        visitors: true,
        materials: true,
        location: true,
        attachments: true,
      } as any,
    });
    if (!r) return res.status(404).json({ message: "Request not found" });

    assertEditable(r.status);

    const requestType = RequestTypeEnum.parse(r.requestType);
    const startAt = r.startAt ? new Date(r.startAt) : null;
    const endAt = r.endAt ? new Date(r.endAt) : null;

    // Global required fields
    if (!r.requestorName) throw new Error("Requestor name is required");
    if (!r.requestorEmail) throw new Error("Requestor email is required");
    if (!r.requestorPhone) throw new Error("Requestor phone is required");
    if (!r.requestorCompany) throw new Error("Requestor company is required");
    if (!r.locationId) throw new Error("Location is required");
    if (!startAt || !endAt) throw new Error("Start and end date/time are required");

    assertDateLogic(startAt, endAt);
    assertDurationByType(requestType, startAt, endAt);

    // Location scope validation
    await assertLocationScope(r.locationId, r.zoneId, (r as any).roomId ?? null);

    // Visitors (global)
    validateVisitors(r.visitors as any[], endAt);

    // Attachments (strict)
    await enforceRequiredAttachments(id, requestType);

    // Request-type specific validation
    const formData = (r as any).formData ?? {};
    if (requestType === "WORK_PERMIT") validateWorkPermit(formData);
    if (requestType === "METHOD_OF_PROCEDURE") validateMop(formData);
    if (requestType === "MATERIAL_VEHICLE_PERMIT") validateMvp(formData, r.materials as any[]);
    if (requestType === "TEMPORARY_ENTRY_PERMISSION") validateTep(formData);
    if (requestType === "ADMIN_VISIT") validateAdminVisit(formData);

    // Create approval stages (minimal deterministic implementation)
    // Phase-1: instantiate stages for the active process definition.
    const proc = await prisma.processDefinition.findFirst({
      where: { requestType: requestType as any, isActive: true },
      include: { stages: true },
    } as any);

    if (!proc) throw new Error("No active approval process configured for this request type");

    await prisma.requestStageInstance.deleteMany({ where: { requestId: id } });

    const stages = Array.isArray((proc as any).stages)
      ? (proc as any).stages
      : await prisma.processStage.findMany({
          where: { processId: proc.id },
          orderBy: { stageOrder: "asc" },
        } as any);

    if (!stages || stages.length === 0) {
      throw new Error("Approval process has no stages configured");
    }

    // Phase-1: mark first stage PENDING, others QUEUED (simple + safe)
    // If your schema doesn't have QUEUED, we fallback everything to PENDING.
    const supportsQueued = true;

    await prisma.requestStageInstance.createMany({
      data: stages
        .sort((a: any, b: any) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0))
        .map((s: any, idx: number) => ({
          requestId: id,
          stageOrder: s.stageOrder ?? idx + 1,
          stageName: s.name ?? `Stage ${idx + 1}`,
          approverRole: s.approverRole ?? "UNKNOWN",
          status: supportsQueued ? (idx === 0 ? "PENDING" : "QUEUED") : "PENDING",
        })),
    } as any);

    // Lock request (handoff)
    const updated = await prisma.accessRequest.update({
      where: { id },
      data: { status: "IN_APPROVAL" } as any,
    });

    return res.json({ ok: true, requestId: id, status: updated.status });
  } catch (e: any) {
    return res.status(400).json({ message: e?.message ?? "Submit failed" });
  }
}
