import { Router } from "express";
import crypto from "crypto";
import prisma from "../../prisma.js";

import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoleAny } from "../middlewares/rbac.middleware.js";

/**
 * Credentials router
 *
 * MVP: Issues RFID / BLE / QR credentials linked to an approved request.
 */
export const credentialsRouter = Router();

credentialsRouter.use(requireAuth);
credentialsRouter.use(requireRoleAny(["SECURITY_SUPERVISOR","SUPER_ADMIN","SECURITY_OFFICER"]));

const token = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");

credentialsRouter.get("/", async (req, res) => {
  const requestId = req.query.requestId ? String(req.query.requestId) : undefined;
  const creds = await prisma.credential.findMany({ where: requestId ? { requestId } : {}, orderBy: { issuedAt: "desc" } });
  res.json(creds);
});

credentialsRouter.post("/issue", async (req, res) => {
  const { requestId, visitorName, type, validFrom, validUntil, allowedZoneIds } = req.body || {};
  if (!requestId || !visitorName || !type || !validFrom || !validUntil) return res.status(400).json({ message: "Missing fields" });

  const reqRow = await prisma.accessRequest.findUnique({ where: { id: String(requestId) } });
  if (!reqRow) return res.status(404).json({ message: "Request not found" });
  if (reqRow.status !== "APPROVED" && reqRow.status !== "ACTIVE") return res.status(400).json({ message: "Request must be approved" });

  const vf = new Date(validFrom);
  const vu = new Date(validUntil);
  if (isNaN(vf.getTime()) || isNaN(vu.getTime()) || vu <= vf) return res.status(400).json({ message: "Invalid validity" });

  const created = await prisma.credential.create({
    data: {
      requestId: String(requestId),
      visitorName: String(visitorName),
      type,
      status: "ISSUED",
      credentialNumber: type === "RFID_CARD" ? `RFID-${token(6)}` : null,
      bleToken: type === "MOBILE_BLE" ? token(20) : null,
      qrToken: type === "QR_PASS" ? token(12) : null,
      validFrom: vf,
      validUntil: vu,
      allowedZoneIds: allowedZoneIds ?? undefined,
    }
  });

  await prisma.auditLog.create({
    data: {
      actorId: (req as any).user?.id,
      entity: "Credential",
      entityId: created.id,
      action: "ISSUE",
      meta: { requestId, type }
    }
  });

  res.json(created);
});

credentialsRouter.post("/:id/suspend", async (req, res) => {
  const id = String(req.params.id);
  const updated = await prisma.credential.update({ where: { id }, data: { status: "SUSPENDED" } });
  await prisma.auditLog.create({ data: { actorId: (req as any).user?.id, entity: "Credential", entityId: id, action: "SUSPEND" } });
  res.json(updated);
});

credentialsRouter.post("/:id/revoke", async (req, res) => {
  const id = String(req.params.id);
  const updated = await prisma.credential.update({ where: { id }, data: { status: "REVOKED", revokedAt: new Date() } });
  await prisma.auditLog.create({ data: { actorId: (req as any).user?.id, entity: "Credential", entityId: id, action: "REVOKE" } });
  res.json(updated);
});

credentialsRouter.post("/:id/replace", async (req, res) => {
  const id = String(req.params.id);
  const old = await prisma.credential.findUnique({ where: { id } });
  if (!old) return res.status(404).json({ message: "Not found" });

  await prisma.credential.update({ where: { id }, data: { status: "LOST", revokedAt: new Date() } });

  const created = await prisma.credential.create({
    data: {
      requestId: old.requestId,
      visitorName: old.visitorName,
      type: old.type,
      status: "ISSUED",
      credentialNumber: old.type === "RFID_CARD" ? `RFID-${token(6)}` : null,
      bleToken: old.type === "MOBILE_BLE" ? token(20) : null,
      qrToken: old.type === "QR_PASS" ? token(12) : null,
      validFrom: old.validFrom,
      validUntil: old.validUntil,
      allowedZoneIds: old.allowedZoneIds ?? undefined,
    }
  });

  await prisma.auditLog.create({ data: { actorId: (req as any).user?.id, entity: "Credential", entityId: created.id, action: "REPLACE", meta: { replaced: id } } });

  res.json(created);
});
