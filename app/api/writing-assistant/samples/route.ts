import { NextResponse } from "next/server"
import { getContentSamplesByUserId, deleteContentSample } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const samples = await getContentSamplesByUserId(userId)

    return NextResponse.json({ samples })
  } catch (error) {
    console.error("Error fetching content samples:", error)
    return NextResponse.json({ error: "Failed to fetch content samples" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { sampleId } = await req.json()

    if (!sampleId) {
      return NextResponse.json({ error: "Sample ID is required" }, { status: 400 })
    }

    const success = await deleteContentSample(sampleId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete sample" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content sample:", error)
    return NextResponse.json({ error: "Failed to delete content sample" }, { status: 500 })
  }
}
