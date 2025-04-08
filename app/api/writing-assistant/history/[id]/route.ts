import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export const runtime = "nodejs"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const contentId = params.id

    if (!contentId) {
      return NextResponse.json({ error: "Content ID is required" }, { status: 400 })
    }

    await sql`DELETE FROM generated_content WHERE id = ${contentId}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting content:", error)
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 })
  }
}
