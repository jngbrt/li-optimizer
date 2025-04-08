import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { cookies } from "next/headers"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Get the session
    let session = null
    let sessionError = null

    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      sessionError = error instanceof Error ? error.message : "Unknown session error"
      console.error("Error getting server session:", error)
    }

    // Get cookies
    const cookieStore = cookies()
    const allCookies = cookieStore.getAll()
    const sessionCookie =
      cookieStore.get("next-auth.session-token") || cookieStore.get("__Secure-next-auth.session-token")

    return NextResponse.json({
      session,
      sessionError,
      cookies: {
        count: allCookies.length,
        hasSessionCookie: !!sessionCookie,
        sessionCookieName: sessionCookie ? sessionCookie.name : null,
        // Don't expose the actual values for security reasons
        names: allCookies.map((c) => c.name),
      },
      timestamp: new Date().toISOString(),
      authOptions: {
        // Only include non-sensitive parts of auth options
        providers: ["linkedin"],
        sessionStrategy: authOptions.session?.strategy || "default",
        hasSecret: !!authOptions.secret,
        hasPages: !!authOptions.pages,
        debug: !!authOptions.debug,
      },
    })
  } catch (error) {
    console.error("Session debug error:", error)
    return NextResponse.json(
      {
        error: "Failed to debug session",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
