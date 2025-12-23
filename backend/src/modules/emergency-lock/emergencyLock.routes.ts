import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { rbacMiddleware } from "../../middlewares/rbac.middleware.js";
import * as ctrl from "./emergencyLock.controller.js";

export const emergencyLockRouter = Router();

// GET /api/zones/lock-status
emergencyLockRouter.get(
  "/zones/lock-status",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "DC_MANAGER", "SUPER_ADMIN"]),
  ctrl.getLockStatus
);

// POST /api/zones/:id/lock
emergencyLockRouter.post(
  "/zones/:id/lock",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "SUPER_ADMIN"]),
  ctrl.postLock
);

// POST /api/zones/:id/unlock
emergencyLockRouter.post(
  "/zones/:id/unlock",
  authMiddleware,
  rbacMiddleware(["SECURITY_OFFICER", "SECURITY_SUPERVISOR", "SUPER_ADMIN"]),
  ctrl.postUnlock
);

// POST /api/zones/lock-all
emergencyLockRouter.post(
  "/zones/lock-all",
  authMiddleware,
  rbacMiddleware(["SECURITY_SUPERVISOR", "SUPER_ADMIN"]),
  ctrl.postLockAll
);
