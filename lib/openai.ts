import OpenAI from "openai"
import type { ContentSample, StyleInsights, StyleProfile, GenerationOptions } from "@/lib/types"

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Analyze writing style from content samples
export async function analyzeWritingStyle(samples: ContentSample[]): Promise<StyleInsights> {
  // Combine all content for analysis
  const combinedText = samples.map((sample) => sample.content).join("\n\n")

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert linguistic analyst specializing in writing style analysis. 
          Analyze the provided text samples to extract detailed insights about the author's writing style.
          Focus on tone, sentence structure, vocabulary level, and recurring patterns.`,
        },
        {
          role: "user",
          content: `Analyze the following content to determine the author's writing style:
          
          ${combinedText}
          
          Provide a detailed analysis in JSON format with the following structure:
          {
            "toneDistribution": {
              "formal": <percentage 0-100>,
              "conversational": <percentage 0-100>,
              "inspirational": <percentage 0-100>
            },
            "sentenceStructure": {
              "simple": <percentage 0-100>,
              "compound": <percentage 0-100>,
              "complex": <percentage 0-100>
            },
            "vocabularyLevel": <score 0-100>,
            "averageSentenceLength": <number>,
            "commonPhrases": [<list of common phrases or expressions used by the author>],
            "topicAreas": [<list of topics or subject areas the author writes about>]
          }
          
          Ensure the percentages in each category add up to 100%.`,
        },
      ],
      temperature: 0.5,
      response_format: { type: "json_object" },
    })

    const analysisResult = JSON.parse(response.choices[0].message.content || "{}")

    return {
      toneDistribution: {
        formal: analysisResult.toneDistribution?.formal || 33,
        conversational: analysisResult.toneDistribution?.conversational || 33,
        inspirational: analysisResult.toneDistribution?.inspirational || 34,
      },
      sentenceStructure: {
        simple: analysisResult.sentenceStructure?.simple || 33,
        compound: analysisResult.sentenceStructure?.compound || 33,
        complex: analysisResult.sentenceStructure?.complex || 34,
      },
      vocabularyLevel: analysisResult.vocabularyLevel || 70,
      averageSentenceLength: analysisResult.averageSentenceLength || 15,
      commonPhrases: analysisResult.commonPhrases || [],
      topicAreas: analysisResult.topicAreas || [],
    }
  } catch (error) {
    console.error("Error analyzing writing style:", error)
    // Return default values if analysis fails
    return {
      toneDistribution: { formal: 33, conversational: 33, inspirational: 34 },
      sentenceStructure: { simple: 33, compound: 33, complex: 34 },
      vocabularyLevel: 70,
      averageSentenceLength: 15,
      commonPhrases: [],
      topicAreas: [],
    }
  }
}

// Generate content based on user's style profile
export async function generatePersonalizedContent(profile: StyleProfile, options: GenerationOptions): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a personalized writing assistant that can perfectly mimic a user's writing style.
          Your task is to generate content that sounds exactly like the user would write it, based on their style profile.`,
        },
        {
          role: "user",
          content: `Generate a ${options.contentType.replace("_", " ")} for LinkedIn that sounds exactly like I would write it.
          
          My writing style has these characteristics:
          - Tone distribution: ${profile.styleInsights.toneDistribution.formal}% formal, ${profile.styleInsights.toneDistribution.conversational}% conversational, ${profile.styleInsights.toneDistribution.inspirational}% inspirational
          - Sentence structure: ${profile.styleInsights.sentenceStructure.simple}% simple, ${profile.styleInsights.sentenceStructure.compound}% compound, ${profile.styleInsights.sentenceStructure.complex}% complex
          - Vocabulary level: ${profile.styleInsights.vocabularyLevel}/100
          - Average sentence length: ${profile.styleInsights.averageSentenceLength} words
          - Common phrases I use: ${profile.styleInsights.commonPhrases.join(", ")}
          - Topics I write about: ${profile.styleInsights.topicAreas.join(", ")}
          
          Content specifications:
          - Goal: ${options.goal.replace("_", " ")}
          - Target audience: ${options.audience.replace("_", " ")}
          - Desired tone: ${options.tone}
          - Length: ${options.length} (${options.length === "short" ? "~100" : options.length === "medium" ? "~200" : "~350"} words)
          - Topic keywords: ${options.topicKeywords || "Use my typical topics"}
          - ${options.includeHashtags ? "Include 2-3 relevant hashtags" : "Do not include hashtags"}
          - ${options.includeCallToAction ? "Include a call-to-action or question at the end" : "No explicit call-to-action needed"}
          
          The content should sound EXACTLY like I wrote it myself, matching my unique style perfectly.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return response.choices[0].message.content || ""
  } catch (error) {
    console.error("Error generating personalized content:", error)
    return "Error generating content. Please try again."
  }
}
