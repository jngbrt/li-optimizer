import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Return a more detailed session response
    return NextResponse.json({
      authenticated: !!session,
      user: session?.user || null,
      expires: session?.expires || null,
      sessionDetails: session
        ? {
            hasSession: true,
            userId: session.user?.id || null,
            userName: session.user?.name || null,
            userEmail: session.user?.email || null,
          }
        : {
            hasSession: false,
            reason: "No active session found",
          },
    })
  } catch (error) {
    console.error("Session fetch error:", error)

    return NextResponse.json(
      {
        authenticated: false,
        error: "Failed to fetch session",
        details: error instanceof Error ? error.message : "Unknown error",
        troubleshooting: "Check server logs for more details",
      },
      { status: 500 },
    )
  }
}
