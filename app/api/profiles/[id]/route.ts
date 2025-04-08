import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Get the profile
    const profileResult = await sql`
      SELECT id, user_id, name, description, sample_count, created_at, updated_at
      FROM style_profiles
      WHERE id = ${id}
    `

    // Handle different possible response formats
    const profileRows = Array.isArray(profileResult)
      ? profileResult
      : profileResult.rows
        ? profileResult.rows
        : Array.isArray(profileResult.data)
          ? profileResult.data
          : []

    if (profileRows.length === 0) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    const profile = profileRows[0]

    // Get the style insights
    const insightsResult = await sql`
      SELECT 
        tone_formal, tone_conversational, tone_inspirational,
        sentence_simple, sentence_compound, sentence_complex,
        vocabulary_level, average_sentence_length, common_phrases, topic_areas
      FROM style_insights
      WHERE profile_id = ${id}
    `

    // Handle different possible response formats
    const insightRows = Array.isArray(insightsResult)
      ? insightsResult
      : insightsResult.rows
        ? insightsResult.rows
        : Array.isArray(insightsResult.data)
          ? insightsResult.data
          : []

    const insights = insightRows.length > 0 ? insightRows[0] : null

    // Get common phrases
    const phrasesResult = await sql`
      SELECT phrase, frequency
      FROM common_phrases
      WHERE profile_id = ${id}
      ORDER BY frequency DESC
    `

    // Handle different possible response formats
    const phraseRows = Array.isArray(phrasesResult)
      ? phrasesResult
      : phrasesResult.rows
        ? phrasesResult.rows
        : Array.isArray(phrasesResult.data)
          ? phrasesResult.data
          : []

    // Get topic areas
    const topicsResult = await sql`
      SELECT topic, relevance_score
      FROM topic_areas
      WHERE profile_id = ${id}
      ORDER BY relevance_score DESC
    `

    // Handle different possible response formats
    const topicRows = Array.isArray(topicsResult)
      ? topicsResult
      : topicsResult.rows
        ? topicsResult.rows
        : Array.isArray(topicsResult.data)
          ? topicsResult.data
          : []

    return NextResponse.json({
      profile: {
        id: profile.id,
        userId: profile.user_id,
        name: profile.name,
        description: profile.description,
        sampleCount: profile.sample_count,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
        styleInsights: insights
          ? {
              toneFormal: insights.tone_formal,
              toneConversational: insights.tone_conversational,
              toneInspirational: insights.tone_inspirational,
              sentenceSimple: insights.sentence_simple,
              sentenceCompound: insights.sentence_compound,
              sentenceComplex: insights.sentence_complex,
              vocabularyLevel: insights.vocabulary_level,
              averageSentenceLength: insights.average_sentence_length,
              commonPhrases: insights.common_phrases || [],
              topicAreas: insights.topic_areas || [],
            }
          : null,
        commonPhrases: phraseRows.map((p) => ({
          phrase: p.phrase,
          frequency: p.frequency,
        })),
        topicAreas: topicRows.map((t) => ({
          topic: t.topic,
          relevanceScore: t.relevance_score,
        })),
      },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}
