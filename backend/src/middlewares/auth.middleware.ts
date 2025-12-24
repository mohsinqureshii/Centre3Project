// backend/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";

/**
 * ============================================================
 *  DEV AUTH MIDDLEWARE  — TEMPORARY FOR FRONTEND INTEGRATION
 * ============================================================
 *
 * ❗ This bypasses real authentication.
 * ❗ It ALWAYS injects a SUPER_ADMIN dev user.
 *
 * Replace with real JWT logic later when login is implemented.
 */

function injectDevUser(req: Request, res: Response, next: NextFunction) {
  (req as any).user = {
    id: "dev-user",
    email: "dev@centre3.local",
    role: "SUPER_ADMIN",
  };

  next();
}

/**
 * Used by most routes
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return injectDevUser(req, res, next);
}

/**
 * Used by older modules (reports, approvals, etc.)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return injectDevUser(req, res, next);
}

export default authMiddleware;
