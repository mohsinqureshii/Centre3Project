import { Router } from "express";
import prisma from "../prisma.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * List credentials (optionally by requestId)
 */
router.get("/", requireAuth, async (req, res) => {
  const requestId = req.query.requestId
    ? String(req.query.requestId)
    : undefined;

  const creds = await prisma.credential.findMany({
    where: requestId ? { requestId } : {},
    orderBy: { issuedAt: "desc" },
  });

  res.json(creds);
});

/**
 * Issue credential (DEV / MVP)
 */
router.post("/", requireAuth, async (req, res) => {
  const {
    requestId,
    visitorName,
    type,
    validFrom,
    validUntil,
    allowedZoneIds,
  } = req.body;

  if (!requestId || !visitorName || !type || !validFrom || !validUntil) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const reqRow = await prisma.accessRequest.findUnique({
    where: { id: String(requestId) },
  });

  if (!reqRow) {
    return res.status(404).json({ message: "Request not found" });
  }

  const credential = await prisma.credential.create({
    data: {
      requestId,
      visitorName,
      type,
      status: "ISSUED",
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      allowedZoneIds: allowedZoneIds ?? null,
    },
  });

  res.json(credential);
});

export default router;
