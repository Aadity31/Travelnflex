import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware to add x-current-path header for all routes
function addPathHeader(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-current-path", request.nextUrl.pathname);
  return response;
}

// For routes that need auth, use withAuth
const authMiddleware = withAuth(
  function middleware(request: NextRequest) {
    return addPathHeader(request);
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Export both - Next.js will use the appropriate one based on the matcher
export default function middleware(request: NextRequest) {
  // Always add the path header first
  return addPathHeader(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
