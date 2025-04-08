import { NextResponse } from "next/server"
import { headers } from "next/headers"

export const runtime = "nodejs"

export async function GET() {
  try {
    const headersList = headers()
    const host = headersList.get("host") || "unknown"
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`

    return NextResponse.json({
      nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
      nextAuthSecret: process.env.NEXTAUTH_SECRET
        ? "Set (length: " + process.env.NEXTAUTH_SECRET.length + ")"
        : "Not set",
      linkedinClientId: process.env.LINKEDIN_CLIENT_ID ? "Set" : "Not set",
      linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET ? "Set" : "Not set",
      nodeEnv: process.env.NODE_ENV || "Not set",
      vercelUrl: process.env.VERCEL_URL || "Not set",
      host,
      baseUrl,
      callbackUrl: `${baseUrl}/api/auth/callback/linkedin`,
      currentTime: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error checking environment variables:", error)
    return NextResponse.json(
      {
        error: "Failed to check environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
