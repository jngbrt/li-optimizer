export interface StyleProfile {
  id: string
  userId: string
  name: string
  description?: string
  sampleCount: number
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  userId: string
  profileId: string
  content: string
  contentType: string
  goal: string
  tone: string
  audience: string
  createdAt: string
  profile?: StyleProfile
}

export interface StyleInsight {
  profileId: string
  toneFormal: number
  toneConversational: number
  toneInspirational: number
  sentenceSimple: number
  sentenceCompound: number
  sentenceComplex: number
  vocabularyLevel: number
  averageSentenceLength: number
  commonPhrases: string[]
  topicAreas: string[]
}

export interface CommonPhrase {
  id: number
  profileId: string
  phrase: string
  frequency: number
}

export interface TopicArea {
  id: number
  profileId: string
  topic: string
  relevanceScore: number
}
