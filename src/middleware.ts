import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const path = pathname.toLowerCase();

  if (path.startsWith("/auth/")) {
    const authenticated = await isAuthenticated(request);
    if (authenticated) {
      return NextResponse.redirect(`${origin}/account`);
    }
  }
}

/**
 * Checks if user is logged in
 * This function cannot be placed with other auth functions, because edge middleware is picky about dependencies
 */
export async function isAuthenticated(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return !!token;
}
