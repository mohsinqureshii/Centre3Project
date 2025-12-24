import { Request, Response, NextFunction } from "express";

/**
 * Guard for Settings module.
 * Assumes `req.user` is populated by auth middleware with `{ id, role }`.
 * If your project uses a different shape, adapt here.
 */
export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const role = (req as any).user?.role;
  if (role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Forbidden: SUPER_ADMIN only" });
  }
  next();
}
