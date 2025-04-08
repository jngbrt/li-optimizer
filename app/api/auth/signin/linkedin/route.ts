import { NextResponse } from "next/server"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  // Redirect to the NextAuth signin endpoint with the LinkedIn provider
  const signinUrl = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}&provider=linkedin`

  return NextResponse.redirect(new URL(signinUrl, request.url))
}
