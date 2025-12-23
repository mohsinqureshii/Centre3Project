import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { rbacMiddleware } from "../../middlewares/rbac.middleware.js";
import * as ctrl from "./alerts.controller.js";

export const alertsRouter = Router();

// View alerts: Security/Managers/Super Admin
alertsRouter.get(
  "/",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "DC_MANAGER", "SUPER_ADMIN"]),
  ctrl.getAlerts
);

alertsRouter.post(
  "/:id/seen",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "DC_MANAGER", "SUPER_ADMIN"]),
  ctrl.postSeen
);

alertsRouter.post(
  "/seen-all",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "DC_MANAGER", "SUPER_ADMIN"]),
  ctrl.postSeenAll
);

// Optional: create alert for staging/testing
alertsRouter.post(
  "/",
  authMiddleware,
  rbacMiddleware(["SECURITY_SUPERVISOR", "SUPER_ADMIN"]),
  ctrl.postCreateAlert
);
