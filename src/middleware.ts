// /src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Read the user role payload out of our secure cookie store
  const userRole = request.cookies.get("ehcms_session_role")?.value;

  // 2. Intercept Protected Views: Bounce to /login if no session cookie exists
  const protectedPaths = ["/consul", "/ambassador", "/hq", "/protocol", "/pcs"];
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. ENFORCE GRANULAR ROLE-BASED ACCESS CONTROL (RBAC) MATRIX
  if (pathname.startsWith("/consul") && userRole !== "HONORARY_CONSUL" && userRole !== "HQ_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  if (pathname.startsWith("/ambassador") && userRole !== "HEAD_OF_MISSION" && userRole !== "HQ_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  if (pathname.startsWith("/hq") && userRole !== "HQ_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  // Strict Protection Gate for Protocol Department Interface
  if (pathname.startsWith("/protocol") && userRole !== "PROTOCOL_OFFICER" && userRole !== "HQ_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  // Strict Protection Gate for PCS Cabinet Approval Oversight Panel
  if (pathname.startsWith("/pcs") && userRole !== "PCS_APPROVER" && userRole !== "HQ_ADMIN") {
    return NextResponse.redirect(new URL("/login?error=unauthorized", request.url));
  }

  return NextResponse.next();
}

// Map the middleware tracker to intercept all relevant workspace path boundaries
export const config = {
  matcher: ["/consul/:path*", "/ambassador/:path*", "/hq/:path*", "/protocol/:path*", "/pcs/:path*"],
};
