import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const { industry, tone, length } = await req.json()

    const prompt = `Create a professional LinkedIn post for a thought leader in the ${industry} industry.

The post should:
- Be ${length || "medium"} length (${length === "short" ? "100-150" : length === "long" ? "300-400" : "200-250"} words)
- Have a ${tone || "professional"} tone
- Start with an engaging hook
- Share valuable insights specific to the ${industry} industry
- Include a call to action or question at the end
- Add 2-3 relevant hashtags

Format it with appropriate line breaks and spacing for LinkedIn.`

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
