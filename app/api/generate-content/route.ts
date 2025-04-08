import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { sql } from "@/lib/db-utils"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { profileId, topic } = await request.json()

    if (!profileId || !topic) {
      return NextResponse.json({ error: "Profile ID and topic are required" }, { status: 400 })
    }

    // Get the style profile details
    const profileResult = await sql`
      SELECT 
        sp.*,
        si.tone_formal, 
        si.tone_conversational, 
        si.tone_inspirational,
        si.sentence_simple, 
        si.sentence_compound, 
        si.sentence_complex,
        si.vocabulary_level, 
        si.average_sentence_length, 
        si.common_phrases, 
        si.topic_areas
      FROM style_profiles sp
      LEFT JOIN style_insights si ON sp.id = si.profile_id
      WHERE sp.id = ${profileId}
    `

    if (profileResult.rows.length === 0) {
      return NextResponse.json({ error: "Style profile not found" }, { status: 404 })
    }

    const profile = profileResult.rows[0]

    // Get common phrases
    const phrasesResult = await sql`
      SELECT phrase, frequency
      FROM common_phrases
      WHERE profile_id = ${profileId}
      ORDER BY frequency DESC
      LIMIT 5
    `

    // Get topic areas
    const topicsResult = await sql`
      SELECT topic, relevance_score
      FROM topic_areas
      WHERE profile_id = ${profileId}
      ORDER BY relevance_score DESC
      LIMIT 5
    `

    // Build the prompt for OpenAI
    const prompt = `
      Create a LinkedIn post about "${topic}" that matches the following writing style profile:

      Style Profile: ${profile.name}
      Description: ${profile.description || "Professional writing style"}

      Tone Distribution:
      - Formal: ${profile.tone_formal || 33}%
      - Conversational: ${profile.tone_conversational || 33}%
      - Inspirational: ${profile.tone_inspirational || 34}%

      Sentence Structure:
      - Simple: ${profile.sentence_simple || 33}%
      - Compound: ${profile.sentence_compound || 33}%
      - Complex: ${profile.sentence_complex || 34}%

      Vocabulary Level: ${profile.vocabulary_level || 70}/100
      Average Sentence Length: ${profile.average_sentence_length || 15} words

      Common Phrases: ${profile.common_phrases ? profile.common_phrases.join(", ") : phrasesResult.rows.map((p) => p.phrase).join(", ")}
      
      Topic Areas: ${profile.topic_areas ? profile.topic_areas.join(", ") : topicsResult.rows.map((t) => t.topic).join(", ")}

      Guidelines:
      - The post should be 150-250 words
      - Include line breaks for readability
      - End with a question to encourage engagement
      - Include 2-3 relevant hashtags
      - The post should sound exactly like it was written by the person with this writing style
      - Focus on providing valuable insights about "${topic}"
    `

    // Generate content using OpenAI
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 500,
    })

    return NextResponse.json({ content: text })
  } catch (error) {
    console.error("Error generating content:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
