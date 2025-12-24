// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";

/**
 * DEV MIDDLEWARE — ALWAYS LOGGED IN AS SUPER ADMIN
 */
function injectDevUser(req: Request, _res: Response, next: NextFunction) {
  (req as any).user = {
    id: "dev-user",
    email: "dev@centre3.local",
    role: "SUPER_ADMIN",
  };
  next();
}

/** MAIN AUTH USED BY ALL ROUTES */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return injectDevUser(req, res, next);
}

/** BACKWARD COMPATIBILITY (OLD ROUTES STILL IMPORT requireAuth) */
export const requireAuth = authMiddleware;

export default authMiddleware;
