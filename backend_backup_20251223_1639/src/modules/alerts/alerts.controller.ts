import { Request, Response } from "express";
import * as svc from "./alerts.service.js";

export async function getAlerts(req: Request, res: Response) {
  const alerts = await svc.listAlerts({
    seen: req.query.seen as string | undefined,
    severity: req.query.severity as string | undefined,
  });
  res.json({ data: alerts });
}

export async function postSeen(req: Request, res: Response) {
  const userId = (req as any).user?.id as string | undefined;
  const updated = await svc.markSeen(req.params.id, userId);
  res.json({ data: updated });
}

export async function postSeenAll(req: Request, res: Response) {
  const userId = (req as any).user?.id as string | undefined;
  const out = await svc.markAllSeen(userId);
  res.json(out);
}

export async function postCreateAlert(req: Request, res: Response) {
  const { title, description, severity, locationId, zoneId, room, entryPoint } = req.body ?? {};
  if (!title || !severity) return res.status(400).json({ message: "title and severity are required" });
  if (!["INFO", "WARNING", "CRITICAL"].includes(severity)) return res.status(400).json({ message: "invalid severity" });

  const created = await svc.createAlert({
    title,
    description,
    severity,
    locationId,
    zoneId,
    room,
    entryPoint,
  });
  res.status(201).json({ data: created });
}
