import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-123" // Default to our sample user

    const result = await sql`
      SELECT id, name, description, sample_count, created_at, updated_at
      FROM style_profiles
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `

    // Handle the response properly, ensuring we have an array to map over
    const profiles = Array.isArray(result)
      ? result
      : result.rows
        ? result.rows
        : Array.isArray(result.data)
          ? result.data
          : []

    return NextResponse.json({
      profiles: profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        description: profile.description,
        sampleCount: profile.sample_count,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      })),
    })
  } catch (error) {
    console.error("Error fetching profiles:", error)
    // Return an empty array instead of failing
    return NextResponse.json({ profiles: [] })
  }
}
