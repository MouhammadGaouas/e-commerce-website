import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Authentication routes that logged-in users should not access
const authRoutes = ["/sign-in", "/sign-up"];

/**
 * Next.js proxy route protection handler
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = Boolean(sessionCookie);

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute = authRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Authenticated users should not access auth pages (/login, /signup)
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. Unauthenticated users must be redirected to /login when visiting protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/sign-in", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Allow all other requests to continue
  return NextResponse.next();
}

export default proxy;

/**
 * Configure matcher so the proxy only executes on relevant routes,
 * keeping public routes, static assets, and auth APIs unaffected.
 */
export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/sign-in",
    "/sign-up",
  ],
};