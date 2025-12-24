// backend/middlewares/rbac.middleware.ts

import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "./auth.middleware.js";

/**
 * A simple RBAC middleware wrapper.
 * It assumes `authMiddleware` already injected req.user.
 */

export function requireRole(requiredRole: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    authMiddleware(req, res, () => {
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (user.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient role" });
      }

      next();
    });
  };
}
