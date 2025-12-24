// backend/modules/settings/alertTypes.routes.ts

import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

/**
 * TEMPORARY DISABLED ROUTES
 * ----------------------------------------
 * Your Prisma schema DOES NOT contain:
 *
 *   model AlertType { ... }
 *
 * Therefore `prisma.alertType` does NOT exist,
 * causing build failures.
 *
 * This placeholder keeps backend stable until
 * AlertType is added to Prisma schema.
 */

/**
 * GET /api/settings/alert-types
 * Returns an empty array for now.
 */
router.get("/", authMiddleware, async (_req, res) => {
  res.json([]);
});

/**
 * POST /api/settings/alert-types
 * Always returns "Not implemented".
 */
router.post("/", authMiddleware, async (_req, res) => {
  res.status(501).json({
    message: "Alert Types are not implemented in schema yet",
  });
});

export default router;
