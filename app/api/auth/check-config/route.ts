import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    const headersList = headers()
    const host = headersList.get("host") || "unknown"

    return NextResponse.json({
      status: "ok",
      config: {
        nextAuthUrl: process.env.NEXTAUTH_URL || `https://${host}`,
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
        linkedinClientId: process.env.LINKEDIN_CLIENT_ID ? "Set" : "Not set",
        linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET ? "Set" : "Not set",
        host,
        nodeEnv: process.env.NODE_ENV || "development",
      },
    })
  } catch (error) {
    console.error("Error checking config:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
