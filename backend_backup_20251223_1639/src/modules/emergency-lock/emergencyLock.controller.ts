import { Request, Response } from "express";
import * as svc from "./emergencyLock.service.js";

export async function getLockStatus(req: Request, res: Response) {
  const data = await svc.listZonesLockStatus();
  res.json({ data });
}

export async function postLock(req: Request, res: Response) {
  const actorId = (req as any).user?.id as string;
  const { reason } = req.body ?? {};
  const evt = await svc.lockZone(req.params.id, actorId, reason);
  res.status(201).json({ data: evt });
}

export async function postUnlock(req: Request, res: Response) {
  const actorId = (req as any).user?.id as string;
  const { reason } = req.body ?? {};
  const evt = await svc.unlockZone(req.params.id, actorId, reason);
  res.status(201).json({ data: evt });
}

export async function postLockAll(req: Request, res: Response) {
  const actorId = (req as any).user?.id as string;
  const { reason } = req.body ?? {};
  const out = await svc.lockAllZones(actorId, reason);
  res.status(201).json(out);
}
