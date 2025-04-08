import { NextResponse } from "next/server"
import OpenAI from "openai"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Use OpenAI to analyze the potential engagement of the post
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert LinkedIn content analyst. Analyze the given LinkedIn post and provide engagement predictions and improvement suggestions.`,
        },
        {
          role: "user",
          content: `Analyze this LinkedIn post and provide engagement predictions and improvement suggestions:
          
          ${content}
          
          Provide a response in JSON format with the following structure:
          {
            "engagementScore": <number between 1-100>,
            "strengths": [<list of post strengths>],
            "improvementSuggestions": [<list of suggestions to improve engagement>],
            "estimatedReactions": <estimated number of reactions>,
            "estimatedComments": <estimated number of comments>,
            "audienceAppeal": <description of which audience segments would engage most>
          }`,
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    })

    const analysisResult = JSON.parse(response.choices[0].message.content || "{}")

    return NextResponse.json(analysisResult)
  } catch (error) {
    console.error("Error analyzing post engagement:", error)
    return NextResponse.json({ error: "Failed to analyze post engagement" }, { status: 500 })
  }
}
