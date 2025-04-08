import { NextResponse } from "next/server"
import { getGeneratedContentByUserId, saveGeneratedContent } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const history = await getGeneratedContentByUserId(userId)

    return NextResponse.json({ history })
  } catch (error) {
    console.error("Error fetching content history:", error)
    return NextResponse.json({ error: "Failed to fetch content history" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { userId, profileId, content, contentType, goal, tone, audience } = await req.json()

    if (!userId || !profileId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const contentId = await saveGeneratedContent({
      userId,
      profileId,
      content,
      contentType: contentType || "linkedin_post",
      goal: goal || "thought_leadership",
      tone: tone || "professional",
      audience: audience || "industry_professionals",
    })

    return NextResponse.json({ success: true, contentId })
  } catch (error) {
    console.error("Error saving content to history:", error)
    return NextResponse.json({ error: "Failed to save content to history" }, { status: 500 })
  }
}
