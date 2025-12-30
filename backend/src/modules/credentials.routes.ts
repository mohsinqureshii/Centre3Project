// import { Router } from "express";
// import prisma from "../prisma.js";
// import { authMiddleware } from "../middlewares/auth.middleware.js";

// const router = Router();

// /**
//  * GET /api/credentials
//  * Returns list of all credentials, ordered by issuedAt
//  */
// router.get("/", authMiddleware, async (_req, res) => {
//   try {
//     const list = await prisma.credential.findMany({
//       orderBy: { issuedAt: "desc" }, // ✅ Correct field
//     });

//     res.json(list);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to load credentials" });
//   }
// });

// export default router;
import { Router } from "express";
import prisma from "../prisma.js";

const router = Router();

// GET credentials with zone names
router.get("/", async (req, res) => {
  try {
    const credentials = await prisma.credential.findMany({
      include: {
        request: {
          include: { zone: true, location: true }
        },
        allowedZones: true
      }
    });

    const result = credentials.map(c => ({
      id: c.id,
      visitorName: c.visitorName,
      type: c.type,
      status: c.status,
      validFrom: c.validFrom,
      validUntil: c.validUntil,
      zoneName: c.request.zone?.name,
      locationName: c.request.location?.siteName,
      allowedZoneNames: c.allowedZones.map(z => z.name)
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch credentials" });
  }
});

// CREATE credential
router.post("/", async (req, res) => {
  try {
    const { visitorName, type, status, validFrom, validUntil, requestId, allowedZoneIds } = req.body;

    const credential = await prisma.credential.create({
      data: {
        visitorName,
        type,
        status,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
        request: { connect: { id: requestId } },
        allowedZones: { connect: allowedZoneIds.map((id: string) => ({ id })) }
      },
      include: { allowedZones: true, request: { include: { zone: true } } }
    });

    res.json({
      id: credential.id,
      visitorName: credential.visitorName,
      type: credential.type,
      status: credential.status,
      validFrom: credential.validFrom,
      validUntil: credential.validUntil,
      zoneName: credential.request.zone?.name,
      allowedZoneNames: credential.allowedZones.map(z => z.name)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create credential" });
  }
});

export default router;
