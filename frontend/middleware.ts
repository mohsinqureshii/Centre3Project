// 🔥 FIXED MIDDLEWARE - NO AUTH CHECK HERE
// Next.js middleware runs on the EDGE (server)
// It CANNOT read localStorage and cookies are unreliable on DigitalOcean.
// We do AUTH CHECK on the CLIENT ONLY.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow ALL routes to load — no redirect here.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // still scan these routes, but no redirect happens
    "/dashboard/:path*",
    "/requests/:path*",
    "/approvals/:path*",
    "/geography/:path*",
    "/credentials/:path*",
    "/security-alerts/:path*",
    "/emergency-lock/:path*",
    "/reports/:path*",
    "/settings/:path*",
  ],
};
