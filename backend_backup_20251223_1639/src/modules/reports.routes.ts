import { Router } from "express";
import prisma from "../../prisma.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRoleAny } from "../middlewares/rbac.middleware.js";

/**
 * Reports router
 *
 * Provides filtered lists and CSV export for compliance.
 * This module intentionally keeps logic simple and Prisma-schema-compatible.
 */
export const reportsRouter = Router();

reportsRouter.use(requireAuth);
reportsRouter.use(requireRoleAny(["SECURITY_OFFICER","SECURITY_SUPERVISOR","DC_MANAGER","COMPLIANCE","SUPER_ADMIN"]));

function parseDate(v?: string) {
  if (!v) return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
}

async function listRequestsByType(requestType: any, req: any) {
  const { siteId, zoneId, status, dateFrom, dateTo } = req.query;
  const from = parseDate(dateFrom);
  const to = parseDate(dateTo);

  const where: any = { requestType };
  if (status) where.status = status;
  if (siteId) where.locationId = String(siteId);
  if (zoneId) where.zoneId = String(zoneId);
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = from;
    if (to) where.createdAt.lte = to;
  }

  const rows = await prisma.accessRequest.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { location: true },
    take: 200,
  });

  const now = Date.now();
  return rows.map(r => ({
    id: r.id,
    requestNo: r.requestNo,
    requestType: r.requestType,
    status: r.status,
    requestorName: r.requestorName,
    siteName: r.location?.siteName,
    zoneId: r.zoneId,
    startAt: r.startAt,
    endAt: r.endAt,
    timeLeftMinutes: Math.max(0, Math.round((new Date(r.endAt).getTime() - now) / 60000)),
    createdAt: r.createdAt,
  }));
}

reportsRouter.get("/admin-visits", async (req, res) => {
  res.json(await listRequestsByType("ADMIN_VISIT", req));
});

reportsRouter.get("/temporary-entry-logs", async (req, res) => {
  res.json(await listRequestsByType("TEMPORARY_ENTRY_PERMISSION", req));
});

reportsRouter.get("/tep-lists", async (req, res) => {
  res.json(await listRequestsByType("TEMPORARY_ENTRY_PERMISSION", req));
});

reportsRouter.get("/export", async (req, res) => {
  const type = String(req.query.type || "");
  const format = String(req.query.format || "csv");
  if (format !== "csv") return res.status(400).json({ message: "Only csv supported in this module" });

  const map: any = {
    "admin-visits": "ADMIN_VISIT",
    "temporary-entry": "TEMPORARY_ENTRY_PERMISSION",
    "tep": "TEMPORARY_ENTRY_PERMISSION",
  };
  const rt = map[type];
  if (!rt) return res.status(400).json({ message: "Invalid type" });

  const data = await listRequestsByType(rt, req);
  const header = ["requestNo","requestType","status","requestorName","siteName","startAt","endAt","timeLeftMinutes","createdAt" ];
  // Fix header typo by not including Arabic char; keep safe
  const hdr = ["requestNo","requestType","status","requestorName","siteName","startAt","endAt","timeLeftMinutes","createdAt"];

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=centre3_${type}_export.csv`);

  const esc = (v: any) => {
    const s = v == null ? "" : String(v);
    if (s.includes(",") || s.includes("\n") || s.includes('"')) return '"' + s.replace(/"/g,'""') + '"';
    return s;
  };

  res.write(hdr.join(",") + "\n");
  for (const row of data) {
    res.write(hdr.map(k => esc((row as any)[k])).join(",") + "\n");
  }
  res.end();
});
