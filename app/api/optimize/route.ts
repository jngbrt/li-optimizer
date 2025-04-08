import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { post, evaluation, goal, industry } = await req.json()

    if (!post || !evaluation || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert LinkedIn content optimizer. 
      
      Original post:
      "${post}"
      
      Based on the following evaluation feedback, optimize this LinkedIn post to better achieve its goal of ${goal.replace("_", " ")} in the ${industry} industry.
      
      Evaluation feedback:
      ${evaluation.feedback.map((f: any) => `- ${f.type}: ${f.message}`).join("\n")}
      
      Goal-specific recommendations:
      ${evaluation.goalAlignment.recommendations.join("\n")}
      
      Keep the core message and professional tone, but enhance it based on the feedback. Maintain a similar length.`,
    })

    return NextResponse.json({ optimizedPost: text })
  } catch (error) {
    console.error("Error in optimization:", error)
    return NextResponse.json({ error: "Failed to optimize post" }, { status: 500 })
  }
}
