import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    const headersList = headers()
    const host = headersList.get("host") || "unknown"
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"

    // Try to get the session to test if it works
    let session = null
    let sessionError = null

    try {
      session = await getServerSession(authOptions)
    } catch (error) {
      sessionError = error instanceof Error ? error.message : "Unknown session error"
    }

    // Determine the base URL
    const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`

    // Check if we're running on Vercel
    const isVercel = process.env.VERCEL === "1"
    const vercelUrl = process.env.VERCEL_URL || null

    // Determine all possible callback URLs
    const callbackUrls = [`${baseUrl}/api/auth/callback/linkedin`]

    if (isVercel && vercelUrl) {
      callbackUrls.push(`https://${vercelUrl}/api/auth/callback/linkedin`)
    }

    // Add www and non-www variants
    if (host.includes("linkedin-agent.work")) {
      callbackUrls.push(`https://linkedin-agent.work/api/auth/callback/linkedin`)
      callbackUrls.push(`https://www.linkedin-agent.work/api/auth/callback/linkedin`)
    }

    return NextResponse.json({
      environment: process.env.NODE_ENV || "Not set",
      nextauthUrl: process.env.NEXTAUTH_URL || "Not set",
      nextauthSecret: process.env.NEXTAUTH_SECRET ? "Set" : "Not set",
      linkedinClientId: process.env.LINKEDIN_CLIENT_ID ? "Set" : "Not set",
      linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET ? "Set" : "Not set",
      vercelUrl: vercelUrl,
      isVercel,
      currentHost: host,
      baseUrl,
      possibleCallbackUrls: callbackUrls,
      session: session ? "Valid session found" : "No session found",
      sessionError,
      importantNote: "Make sure ALL these callback URLs are configured in your LinkedIn OAuth app settings",
      troubleshooting: [
        "Ensure NEXTAUTH_URL is set correctly",
        "Verify NEXTAUTH_SECRET is set and is a strong random string",
        "Check that all callback URLs are configured in LinkedIn OAuth settings",
        "Try clearing browser cookies and cache",
        "Ensure your LinkedIn app has the correct permissions",
      ],
    })
  } catch (error) {
    console.error("Debug endpoint error:", error)
    return NextResponse.json(
      { error: "Debug endpoint error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
