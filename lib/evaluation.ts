import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { PostGoal, EvaluationResult } from "./types"

// Goal-specific evaluation criteria
const goalCriteria: Record<PostGoal, string[]> = {
  thought_leadership: [
    "Demonstrates deep industry knowledge",
    "Offers unique insights or perspectives",
    "Challenges conventional thinking",
    "Provides actionable takeaways",
    "Establishes credibility and authority",
  ],
  network_growth: [
    "Encourages meaningful connections",
    "Invites professional dialogue",
    "Demonstrates value to potential connections",
    "Highlights collaborative opportunities",
    "Shows genuine interest in building relationships",
  ],
  engagement: [
    "Poses thought-provoking questions",
    "Creates emotional connection",
    "Uses storytelling effectively",
    "Encourages comments and discussion",
    "Includes clear call-to-action",
  ],
  lead_generation: [
    "Demonstrates problem-solving expertise",
    "Addresses specific pain points",
    "Establishes clear value proposition",
    "Includes subtle call-to-action",
    "Positions as trusted advisor",
  ],
  brand_awareness: [
    "Communicates consistent personal brand voice",
    "Highlights unique professional identity",
    "Reinforces core expertise areas",
    "Demonstrates personality and authenticity",
    "Aligns with target audience interests",
  ],
  career_advancement: [
    "Showcases relevant achievements",
    "Demonstrates industry knowledge",
    "Highlights transferable skills",
    "Shows leadership potential",
    "Aligns with career trajectory",
  ],
  industry_influence: [
    "Addresses industry trends or challenges",
    "Offers forward-thinking perspectives",
    "References relevant data or research",
    "Positions as industry advocate",
    "Demonstrates thought leadership",
  ],
  content_repurposing: [
    "Adapts content appropriately for LinkedIn",
    "Maintains core message integrity",
    "Includes proper attribution if applicable",
    "Adds new context or insights",
    "Encourages cross-platform engagement",
  ],
}

export async function evaluatePost(post: string, goal: PostGoal, industry: string): Promise<EvaluationResult> {
  try {
    // For demo purposes, we'll simulate the API call with a timeout
    // In a real implementation, this would call your evaluation API

    // This is where you would integrate with your existing evaluation framework
    const criteria = goalCriteria[goal] || goalCriteria.thought_leadership

    // Simulate evaluation process
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Sample evaluation result - in a real implementation, this would come from your AI model
    const result: EvaluationResult = {
      overallScore: Math.floor(Math.random() * 30) + 65, // Random score between 65-95
      categories: [
        { name: "Content Quality", score: Math.floor(Math.random() * 20) + 75 },
        { name: "Audience Relevance", score: Math.floor(Math.random() * 25) + 70 },
        { name: "Engagement Potential", score: Math.floor(Math.random() * 30) + 65 },
        { name: "Professional Tone", score: Math.floor(Math.random() * 15) + 80 },
        { name: "Call to Action", score: Math.floor(Math.random() * 40) + 55 },
      ],
      feedback: [
        {
          type: "positive",
          message: "Strong opening that immediately establishes your expertise in the industry.",
        },
        {
          type: "positive",
          message: "Excellent use of specific examples that demonstrate your hands-on experience.",
        },
        {
          type: "suggestion",
          message: "Consider adding 1-2 more industry-specific hashtags to increase visibility.",
        },
        {
          type: "suggestion",
          message: "Your call-to-action question could be more specific to encourage targeted responses.",
        },
        {
          type: "issue",
          message: "The middle section is somewhat lengthy and could be condensed for better readability.",
        },
      ],
      goalAlignment: {
        score: Math.floor(Math.random() * 25) + 70,
        metrics: criteria.map((name) => ({
          name,
          score: Math.floor(Math.random() * 40) + 60,
        })),
        recommendations: [
          "Add a specific insight from your personal experience to strengthen thought leadership positioning.",
          "Include a statistic or data point to support your main argument.",
          "End with a more targeted question that invites industry-specific responses.",
        ],
      },
    }

    return result
  } catch (error) {
    console.error("Error evaluating post:", error)
    throw error
  }
}

export async function optimizePost(
  originalPost: string,
  evaluation: EvaluationResult,
  goal: PostGoal,
  industry: string,
): Promise<string> {
  try {
    // In a real implementation, this would use your AI optimizer with the evaluation feedback

    // For demo purposes, we'll use the AI SDK to generate an optimized post
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert LinkedIn content optimizer. 
      
      Original post:
      "${originalPost}"
      
      Based on the following evaluation feedback, optimize this LinkedIn post to better achieve its goal of ${goal.replace("_", " ")} in the ${industry} industry.
      
      Evaluation feedback:
      ${evaluation.feedback.map((f) => `- ${f.type}: ${f.message}`).join("\n")}
      
      Goal-specific recommendations:
      ${evaluation.goalAlignment.recommendations.join("\n")}
      
      Keep the core message and professional tone, but enhance it based on the feedback. Maintain a similar length.`,
    })

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return text
  } catch (error) {
    console.error("Error optimizing post:", error)
    // Return original post if optimization fails
    return originalPost
  }
}
