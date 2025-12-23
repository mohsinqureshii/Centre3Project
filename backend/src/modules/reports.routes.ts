import { Router } from "express";
import prisma from "../prisma.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * List requests by type (basic reporting)
 */
router.get("/requests/:type", requireAuth, async (req, res) => {
  const type = req.params.type;

  const requests = await prisma.accessRequest.findMany({
    where: { requestType: type as any },
    orderBy: { createdAt: "desc" },
    include: {
      location: true,
    },
  });

  res.json(
    requests.map((r) => ({
      requestNo: r.requestNo,
      requestType: r.requestType,
      status: r.status,
      requestorName: r.requestorName,
      siteName: r.location.siteName,
      startAt: r.startAt,
      endAt: r.endAt,
      createdAt: r.createdAt,
    }))
  );
});

export default router;
