import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log all auth-related requests for debugging
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    console.log(`Auth request: ${request.method} ${request.nextUrl.pathname}`)

    // Log cookies for debugging (but not their values)
    const cookieNames = Array.from(request.cookies.keys())
    console.log(`Cookies present: ${cookieNames.join(", ")}`)

    // Check for session cookie specifically
    const hasSessionCookie =
      request.cookies.has("next-auth.session-token") || request.cookies.has("__Secure-next-auth.session-token")
    console.log(`Session cookie present: ${hasSessionCookie}`)
  }

  return NextResponse.next()
}

// Only run middleware on auth-related paths
export const config = {
  matcher: ["/api/auth/:path*"],
}
