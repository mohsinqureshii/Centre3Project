import { Response, NextFunction } from "express";
import { AuthedRequest } from "./auth.middleware.js";
export function requireRoles(roles:string[]){
  return (req:AuthedRequest,res:Response,next:NextFunction)=>{
    if(!req.user) return res.status(401).json({error:"Unauthenticated"});
    if(!roles.includes(req.user.role)) return res.status(403).json({error:"Forbidden"});
    next();
  };
}


// Alias used by some module patches
export const rbacMiddleware = requireRoles;
export const requireRoleAny = requireRoles;
