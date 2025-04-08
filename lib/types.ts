// Existing types from previous implementation
export type PostGoal =
  | "thought_leadership"
  | "network_growth"
  | "engagement"
  | "lead_generation"
  | "brand_awareness"
  | "career_advancement"
  | "industry_influence"
  | "content_repurposing"

export type FeedbackType = "positive" | "suggestion" | "issue"

export interface FeedbackItem {
  type: FeedbackType
  message: string
}

export interface CategoryScore {
  name: string
  score: number
  feedback?: string
}

export interface GoalMetric {
  name: string
  score: number
}

export interface GoalAlignment {
  score: number
  metrics: GoalMetric[]
  recommendations: string[]
}

export interface EvaluationResult {
  overallScore: number
  categories: CategoryScore[]
  feedback: FeedbackItem[]
  goalAlignment: GoalAlignment
}

// Updated types for the writing assistant feature
export interface ContentSample {
  id: string
  userId: string
  title?: string
  content: string
  contentType: string
  wordCount: number
  source: "paste" | "file" | "url"
  sourceUrl?: string
  createdAt?: string
  updatedAt?: string
}

export interface StyleInsights {
  toneDistribution: {
    formal: number
    conversational: number
    inspirational: number
  }
  sentenceStructure: {
    simple: number
    compound: number
    complex: number
  }
  vocabularyLevel: number
  averageSentenceLength: number
  commonPhrases: string[]
  topicAreas: string[]
}

export interface StyleProfile {
  id: string
  userId: string
  name: string
  description?: string
  sampleCount: number
  createdAt: string
  updatedAt: string
  styleInsights: StyleInsights
}

export interface CommonPhrase {
  id: string
  profileId: string
  phrase: string
  frequency: number
  createdAt: string
}

export interface TopicArea {
  id: string
  profileId: string
  topic: string
  relevanceScore: number
  createdAt: string
}

export interface GeneratedContent {
  id: string
  userId: string
  profileId: string
  content: string
  contentType: string
  goal: string
  tone: string
  audience: string
  createdAt: string
}

export interface GenerationOptions {
  tone: string
  audience: string
  goal: string
  contentType: string
  length: string
  includeHashtags: boolean
  includeCallToAction: boolean
  topicKeywords: string
}
