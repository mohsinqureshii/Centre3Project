import prisma from "../../prisma.js";

export type AlertsQuery = {
  seen?: string;
  severity?: string;
};

export async function listAlerts(q: AlertsQuery) {
  const where: any = {};

  if (q.seen === "true") where.isSeen = true;
  if (q.seen === "false") where.isSeen = false;

  if (q.severity && ["INFO", "WARNING", "CRITICAL"].includes(q.severity)) {
    where.severity = q.severity;
  }

  return prisma.securityAlert.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export async function markSeen(alertId: string, userId?: string) {
  return prisma.securityAlert.update({
    where: { id: alertId },
    data: {
      isSeen: true,
      seenAt: new Date(),
      seenByUserId: userId ?? null,
    },
  });
}

export async function markAllSeen(userId?: string) {
  await prisma.securityAlert.updateMany({
    where: { isSeen: false },
    data: {
      isSeen: true,
      seenAt: new Date(),
      seenByUserId: userId ?? null,
    },
  });
  return { ok: true };
}

// Optional: helps testing in staging without ACS integration
export async function createAlert(input: {
  title: string;
  description?: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  locationId?: string;
  zoneId?: string;
  room?: string;
  entryPoint?: string;
}) {
  return prisma.securityAlert.create({
    data: {
      title: input.title,
      description: input.description,
      severity: input.severity,
      locationId: input.locationId,
      zoneId: input.zoneId,
      room: input.room,
      entryPoint: input.entryPoint,
      isSeen: false,
    },
  });
}
