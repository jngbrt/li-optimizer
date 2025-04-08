import { NextResponse } from "next/server"
import { generatePersonalizedContent } from "@/lib/openai"
import { getStyleProfileById, saveGeneratedContent } from "@/lib/db"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { userId, profileId, options } = await req.json()

    if (!userId || !profileId || !options) {
      return NextResponse.json(
        { error: "Invalid request. User ID, profile ID, and generation options are required." },
        { status: 400 },
      )
    }

    // Get the style profile
    const profile = await getStyleProfileById(profileId)

    if (!profile) {
      return NextResponse.json({ error: "Style profile not found" }, { status: 404 })
    }

    // Generate personalized content
    const generatedContent = await generatePersonalizedContent(profile, options)

    // Save generated content to database
    await saveGeneratedContent({
      userId,
      profileId,
      content: generatedContent,
      contentType: options.contentType,
      goal: options.goal,
      tone: options.tone,
      audience: options.audience,
    })

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error("Error generating personalized content:", error)
    return NextResponse.json({ error: "Failed to generate personalized content" }, { status: 500 })
  }
}
