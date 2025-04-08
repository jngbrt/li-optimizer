import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type Industry = "technology" | "finance" | "healthcare" | "marketing" | "education" | "consulting" | "hr" | "legal"

const industryPrompts: Record<Industry, string> = {
  technology: "Create a thought leadership post about digital transformation or emerging tech trends",
  finance: "Create a thought leadership post about financial markets or investment strategies",
  healthcare: "Create a thought leadership post about healthcare innovation or patient care",
  marketing: "Create a thought leadership post about digital marketing strategies or brand building",
  education: "Create a thought leadership post about educational innovation or learning methodologies",
  consulting: "Create a thought leadership post about business strategy or organizational change",
  hr: "Create a thought leadership post about talent acquisition or workplace culture",
  legal: "Create a thought leadership post about legal tech or regulatory compliance",
}

export async function generateThoughtLeadershipPost(industry: string): Promise<string> {
  try {
    const prompt =
      industryPrompts[industry as Industry] ||
      "Create a professional thought leadership post for LinkedIn that demonstrates expertise and invites engagement"

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `${prompt}. 
      
      The post should:
      - Be between 150-250 words
      - Include a hook in the first line
      - Share a valuable insight or lesson
      - End with a question to encourage engagement
      - Include 2-3 relevant hashtags
      
      Format it with appropriate line breaks and spacing for LinkedIn.`,
    })

    return text
  } catch (error) {
    console.error("Error generating post:", error)
    return "I've been reflecting on our industry's direction lately...\n\nWhat trends are you seeing in your work? I'd love to hear your thoughts.\n\n#ThoughtLeadership #ProfessionalDevelopment"
  }
}
