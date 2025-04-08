import { NextResponse } from "next/server"
import { getProviders } from "next-auth/react"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Get the providers
    const providers = await getProviders()

    // Return a properly formatted JSON response
    return NextResponse.json(providers || {})
  } catch (error) {
    console.error("Error fetching providers:", error)

    // Return a proper error response in JSON format
    return NextResponse.json(
      {
        error: "Failed to fetch providers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
