import { Request, Response, NextFunction } from "express";

/**
 * DEV AUTH MIDDLEWARE (TEMPORARY)
 *
 * This file intentionally exports BOTH:
 *  - authMiddleware
 *  - requireAuth
 *
 * So existing imports do NOT break.
 *
 * ✔ Allows any request with Authorization header
 * ✔ Injects SUPER_ADMIN user for dev
 *
 * 🚨 Replace with real JWT logic in Module 1
 */

function baseAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Missing Authorization header",
    });
  }

  // DEV USER CONTEXT
  (req as any).user = {
    id: "dev-user",
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
  return baseAuth(req, res, next);
}

/**
 * Used by older modules (reports, etc.)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return baseAuth(req, res, next);
}
