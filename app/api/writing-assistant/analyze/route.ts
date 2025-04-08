import { NextResponse } from "next/server"
import { analyzeWritingStyle } from "@/lib/openai"
import { saveContentSample, saveStyleProfile, saveStyleInsights } from "@/lib/db"
import type { ContentSample } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { userId, samples } = await req.json()

    if (!userId || !samples || !Array.isArray(samples) || samples.length === 0) {
      return NextResponse.json({ error: "Invalid request. User ID and content samples are required." }, { status: 400 })
    }

    // Save content samples to database
    const savedSampleIds = []
    for (const sample of samples) {
      const contentSample: Omit<ContentSample, "id"> = {
        userId,
        title: sample.title,
        content: sample.content,
        contentType: sample.contentType,
        wordCount: sample.wordCount,
        source: sample.source,
        sourceUrl: sample.sourceUrl,
      }

      const sampleId = await saveContentSample(contentSample)
      savedSampleIds.push(sampleId)
    }

    // Analyze writing style
    const styleInsights = await analyzeWritingStyle(samples)

    // Create style profile
    const profileName = samples[0].title
      ? `Style from ${samples[0].title}`
      : `Writing Style ${new Date().toLocaleDateString()}`

    const profileId = await saveStyleProfile({
      userId,
      name: profileName,
      description: `Style extracted from ${samples.length} content samples`,
      sampleCount: samples.length,
    })

    // Save style insights
    await saveStyleInsights(profileId, styleInsights)

    // Get the full profile to return
    const profile = {
      id: profileId,
      userId,
      name: profileName,
      description: `Style extracted from ${samples.length} content samples`,
      sampleCount: samples.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      styleInsights,
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error analyzing writing style:", error)
    return NextResponse.json({ error: "Failed to analyze writing style" }, { status: 500 })
  }
}
