import prisma from "../../prisma.js";
import { getZoneOccupancy } from "../../utils/occupancy.js";

export async function listZonesLockStatus() {
  const zones = await prisma.zone.findMany({
    include: {
      location: true,
      lockEvents: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const enriched = await Promise.all(
    zones.map(async (z) => {
      const latest = z.lockEvents[0];
      const state = latest?.state ?? "ACTIVE";
      const occupancy = await getZoneOccupancy(z.id);
      return {
        id: z.id,
        name: z.name,
        code: z.code,
        locationId: z.locationId,
        locationName: z.location.siteName,
        state,
        occupancy,
        updatedAt: latest?.createdAt ?? null,
      };
    })
  );

  return enriched;
}

export async function lockZone(zoneId: string, actorId: string, reason?: string) {
  const evt = await prisma.zoneLockEvent.create({
    data: {
      zoneId,
      state: "LOCKED",
      actorId,
      reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId,
      entity: "Zone",
      entityId: zoneId,
      action: "LOCK_ZONE",
      meta: { reason: reason ?? null },
    },
  });

  return evt;
}

export async function unlockZone(zoneId: string, actorId: string, reason?: string) {
  const evt = await prisma.zoneLockEvent.create({
    data: {
      zoneId,
      state: "ACTIVE",
      actorId,
      reason,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId,
      entity: "Zone",
      entityId: zoneId,
      action: "UNLOCK_ZONE",
      meta: { reason: reason ?? null },
    },
  });

  return evt;
}

export async function lockAllZones(actorId: string, reason?: string) {
  const zones = await prisma.zone.findMany({ select: { id: true } });
  await prisma.zoneLockEvent.createMany({
    data: zones.map((z) => ({
      zoneId: z.id,
      state: "LOCKED",
      actorId,
      reason,
    })),
  });

  await prisma.auditLog.create({
    data: {
      actorId,
      entity: "Zone",
      entityId: "ALL",
      action: "LOCK_ALL_ZONES",
      meta: { reason: reason ?? null },
    },
  });

  return { ok: true, locked: zones.length };
}
