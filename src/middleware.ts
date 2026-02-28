// src/middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow auth API routes to pass through
        if (req.nextUrl.pathname.startsWith('/api/auth')) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};