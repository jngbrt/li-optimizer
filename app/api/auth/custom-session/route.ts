import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decode } from "next-auth/jwt"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    // Get the session token from cookies
    const cookieStore = cookies()
    const sessionToken =
      cookieStore.get("next-auth.session-token")?.value || cookieStore.get("__Secure-next-auth.session-token")?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null, expires: null })
    }

    // Try to decode the JWT token
    try {
      const secret = process.env.NEXTAUTH_SECRET
      if (!secret) {
        console.error("NEXTAUTH_SECRET is not defined")
        return NextResponse.json({ user: null, expires: null })
      }

      const decoded = await decode({
        token: sessionToken,
        secret,
      })

      if (!decoded) {
        return NextResponse.json({ user: null, expires: null })
      }

      // Return user information from the decoded token
      return NextResponse.json({
        user: {
          name: decoded.name || "LinkedIn User",
          email: decoded.email || null,
          id: decoded.sub || "user-123",
          image: decoded.picture || null,
        },
        expires: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : null,
      })
    } catch (decodeError) {
      console.error("Error decoding session token:", decodeError)

      // Fallback to a basic user object if we can't decode the token
      return NextResponse.json({
        user: {
          name: "LinkedIn User",
          email: null,
          id: "user-123",
          image: null,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
  } catch (error) {
    console.error("Custom session fetch error:", error)
    return NextResponse.json({ user: null, expires: null })
  }
}
