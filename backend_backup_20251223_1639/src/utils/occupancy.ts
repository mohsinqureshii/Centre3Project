import prisma from "../../prisma.js";

/**
 * Occupancy = number of requests in a zone where the latest CheckEvent is CHECK_IN
 * and there is no later CHECK_OUT. This is MVP-safe and does not require ACS integration.
 */
export async function getZoneOccupancy(zoneId: string): Promise<number> {
  // Get candidate requests in this zone that are not expired.
  const requests = await prisma.accessRequest.findMany({
    where: {
      zoneId,
      status: { in: ["APPROVED", "ACTIVE"] },
      endAt: { gt: new Date() },
    },
    select: { id: true },
  });

  if (requests.length === 0) return 0;

  const requestIds = requests.map((r) => r.id);

  // Fetch latest check events per request.
  // MySQL doesn't support DISTINCT ON; do a cheap approach: pull recent events and reduce in JS.
  const events = await prisma.checkEvent.findMany({
    where: { requestId: { in: requestIds } },
    orderBy: { createdAt: "desc" },
    select: { requestId: true, type: true, createdAt: true },
  });

  const latestByReq = new Map<string, { type: string; createdAt: Date }>();
  for (const e of events) {
    if (!latestByReq.has(e.requestId)) latestByReq.set(e.requestId, { type: e.type, createdAt: e.createdAt });
  }

  let count = 0;
  for (const id of requestIds) {
    const latest = latestByReq.get(id);
    if (latest?.type === "CHECK_IN") count += 1;
  }

  return count;
}
