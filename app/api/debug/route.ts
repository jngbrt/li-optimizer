import { NextResponse } from "next/server"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET() {
  return NextResponse.json({
    nextauthUrl: process.env.NEXTAUTH_URL || "Not set",
    linkedinClientId: process.env.LINKEDIN_CLIENT_ID ? "Set" : "Not set",
    linkedinClientSecret: process.env.LINKEDIN_CLIENT_SECRET ? "Set" : "Not set",
    host: process.env.VERCEL_URL || "Not set",
    baseUrl: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "Not set",
  })
}
