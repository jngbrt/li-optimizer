import { NextResponse } from "next/server"
import { getStyleProfilesByUserId, deleteStyleProfile } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const profiles = await getStyleProfilesByUserId(userId)

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error("Error fetching style profiles:", error)
    return NextResponse.json({ error: "Failed to fetch style profiles" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { profileId } = await req.json()

    if (!profileId) {
      return NextResponse.json({ error: "Profile ID is required" }, { status: 400 })
    }

    const success = await deleteStyleProfile(profileId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete profile" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting style profile:", error)
    return NextResponse.json({ error: "Failed to delete style profile" }, { status: 500 })
  }
}
