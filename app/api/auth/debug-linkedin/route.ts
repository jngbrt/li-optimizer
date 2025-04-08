import { NextResponse } from "next/server"
import { headers } from "next/headers"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  try {
    const headersList = headers()
    const host = headersList.get("host") || "unknown"
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
    const baseUrl = `${protocol}://${host}`

    // Get all the possible callback URLs
    const possibleCallbackUrls = [
      `${baseUrl}/api/auth/callback/linkedin`,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/api/auth/callback/linkedin` : null,
      process.env.NEXTAUTH_URL ? `${process.env.NEXTAUTH_URL}/api/auth/callback/linkedin` : null,
    ].filter(Boolean) as string[]

    // List of authorized redirect URLs from the user's input
    const authorizedRedirectUrls = [
      "https://www.linkedin-agent.work/api/auth/callback/linkedin",
      "https://v0-linkedin-optimizer.vercel.app/api/auth/callback/linkedin",
      "https://v0-linkedin-optimizer-jngbrt-jngbrts-projects.vercel.app/api/auth/callback/linkedin",
      "https://v0-linkedin-optimizer-jngbrts-projects.vercel.app/api/auth/callback/linkedin",
      "https://v0-linkedin-optimizer-wcswjx.vercel.app/api/auth/callback/linkedin",
      "https://v0-linkedin-optimizer-n29bfmm5x-jngbrts-projects.vercel.app/api/auth/callback/linkedin",
    ]

    // Check if any of our possible callback URLs match the authorized ones
    const matchingUrls = possibleCallbackUrls.filter((url) => authorizedRedirectUrls.includes(url))

    // Check if the current host's callback URL is authorized
    const currentCallbackUrl = `${baseUrl}/api/auth/callback/linkedin`
    const isCurrentCallbackAuthorized = authorizedRedirectUrls.includes(currentCallbackUrl)

    return NextResponse.json({
      linkedinConfig: {
        clientId: process.env.LINKEDIN_CLIENT_ID ? "✓ Set" : "✗ Not set",
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET ? "✓ Set" : "✗ Not set",
        nextAuthUrl: process.env.NEXTAUTH_URL || "Not set",
        vercelUrl: process.env.VERCEL_URL || "Not set",
      },
      currentHost: host,
      currentCallbackUrl,
      possibleCallbackUrls,
      authorizedRedirectUrls,
      matchingUrls,
      callbackStatus: isCurrentCallbackAuthorized
        ? "✓ Current callback URL is authorized"
        : "✗ Current callback URL is NOT authorized",
      recommendation: !isCurrentCallbackAuthorized
        ? `Add "${currentCallbackUrl}" to your LinkedIn OAuth app's authorized redirect URLs`
        : "Your callback URL configuration looks good",
      nextSteps: !isCurrentCallbackAuthorized
        ? [
            "1. Go to your LinkedIn Developer Console",
            "2. Select your OAuth app",
            "3. Go to Auth tab",
            `4. Add "${currentCallbackUrl}" to the Authorized Redirect URLs`,
            "5. Save changes and try again",
          ]
        : ["Your configuration looks good. If you're still having issues, check the server logs."],
    })
  } catch (error) {
    console.error("Error debugging LinkedIn config:", error)
    return NextResponse.json(
      {
        error: "Failed to debug LinkedIn configuration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
