import { NextResponse } from "next/server"
import type { EvaluationResult } from "@/lib/types"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { post, goal, industry } = await req.json()

    if (!post || !goal) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // This is where you would integrate with your evaluation framework API
    // For demo purposes, we'll create a simulated response

    const evaluationResult: EvaluationResult = {
      overallScore: 78,
      categories: [
        { name: "Content Quality", score: 82 },
        { name: "Audience Relevance", score: 75 },
        { name: "Engagement Potential", score: 70 },
        { name: "Professional Tone", score: 85 },
        { name: "Call to Action", score: 65 },
      ],
      feedback: [
        {
          type: "positive",
          message: "Strong opening that captures attention and establishes expertise.",
        },
        {
          type: "positive",
          message: "Good use of industry-specific terminology that resonates with your target audience.",
        },
        {
          type: "suggestion",
          message: "Consider adding more specific examples to support your main points.",
        },
        {
          type: "suggestion",
          message: "Your call-to-action could be more compelling to drive engagement.",
        },
        {
          type: "issue",
          message: "The post is slightly longer than optimal for LinkedIn engagement.",
        },
      ],
      goalAlignment: {
        score: 76,
        metrics: [
          { name: "Demonstrates industry knowledge", score: 85 },
          { name: "Offers unique insights", score: 70 },
          { name: "Challenges conventional thinking", score: 65 },
          { name: "Provides actionable takeaways", score: 75 },
          { name: "Establishes credibility", score: 80 },
        ],
        recommendations: [
          "Add a specific insight from your personal experience to strengthen thought leadership positioning.",
          "Include a statistic or data point to support your main argument.",
          "End with a more targeted question that invites industry-specific responses.",
        ],
      },
    }

    return NextResponse.json(evaluationResult)
  } catch (error) {
    console.error("Error in evaluation:", error)
    return NextResponse.json({ error: "Failed to evaluate post" }, { status: 500 })
  }
}
