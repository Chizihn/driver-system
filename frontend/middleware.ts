import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value; // or however you store auth

  const isAuth = !!token;
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  if (!isAuth && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Protect all dashboard routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/verify/:path*",
    "/scan-qr/:path*",
    "/drivers/:path*",
    "/documents/:path*",
    "/history/:path*",
    "/login",
    "/register",
  ],
};
