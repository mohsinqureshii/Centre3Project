import jwt from "jsonwebtoken";
export function signToken(p:any,s:string){return jwt.sign(p,s,{expiresIn:"8h"});}
export function verifyToken(t:string,s:string){return jwt.verify(t,s) as any;}
