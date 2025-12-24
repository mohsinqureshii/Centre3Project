import { Router } from "express";

const router = Router();

/**
 * GET /api/settings/roles
 * Static roles (enum-backed)
 */
router.get("/", (_req, res) => {
  res.json([
    "SUPER_ADMIN",
    "SECURITY_OFFICER",
    "SECURITY_SUPERVISOR",
    "DC_MANAGER",
    "COMPLIANCE",
    "REQUESTOR",
  ]);
});

export default router;
