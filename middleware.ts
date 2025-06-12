import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Handle static files
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/api/") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // Handle root path
  if (request.nextUrl.pathname === "/") {
    return NextResponse.next()
  }

  // Handle access routes
  if (request.nextUrl.pathname.startsWith("/access/")) {
    return NextResponse.next()
  }

  // Handle shared routes
  if (request.nextUrl.pathname.startsWith("/shared/")) {
    return NextResponse.next()
  }

  // For any other routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
