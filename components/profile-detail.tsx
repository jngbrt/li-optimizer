import type { StyleProfile } from "@/types"
import { formatDate } from "@/lib/db-utils"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ProfileDetailProps {
  profile: StyleProfile & {
    styleInsights?: {
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
    } | null
    commonPhrases?: { phrase: string; frequency: number }[]
    topicAreas?: { topic: string; relevanceScore: number }[]
  }
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  // Ensure we have arrays even if they're undefined
  const commonPhrases = profile.styleInsights?.commonPhrases || profile.commonPhrases || []
  const topicAreas = profile.styleInsights?.topicAreas || profile.topicAreas || []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{profile.name}</h3>
        <p className="text-muted-foreground">{profile.description}</p>
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Created: {formatDate(profile.createdAt)}</span>
          <span>Samples: {profile.sampleCount}</span>
        </div>
      </div>

      {profile.styleInsights && (
        <>
          <div className="space-y-4">
            <h4 className="font-medium">Tone Distribution</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Formal</span>
                <span>{profile.styleInsights.toneFormal}%</span>
              </div>
              <Progress value={profile.styleInsights.toneFormal} />

              <div className="flex justify-between text-sm">
                <span>Conversational</span>
                <span>{profile.styleInsights.toneConversational}%</span>
              </div>
              <Progress value={profile.styleInsights.toneConversational} />

              <div className="flex justify-between text-sm">
                <span>Inspirational</span>
                <span>{profile.styleInsights.toneInspirational}%</span>
              </div>
              <Progress value={profile.styleInsights.toneInspirational} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Sentence Structure</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Simple</span>
                <span>{profile.styleInsights.sentenceSimple}%</span>
              </div>
              <Progress value={profile.styleInsights.sentenceSimple} />

              <div className="flex justify-between text-sm">
                <span>Compound</span>
                <span>{profile.styleInsights.sentenceCompound}%</span>
              </div>
              <Progress value={profile.styleInsights.sentenceCompound} />

              <div className="flex justify-between text-sm">
                <span>Complex</span>
                <span>{profile.styleInsights.sentenceComplex}%</span>
              </div>
              <Progress value={profile.styleInsights.sentenceComplex} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Vocabulary Level</h4>
              <div className="flex justify-between text-sm mb-2">
                <span>Level</span>
                <span>{profile.styleInsights.vocabularyLevel}/100</span>
              </div>
              <Progress value={profile.styleInsights.vocabularyLevel} />
            </div>

            <div>
              <h4 className="font-medium mb-2">Average Sentence Length</h4>
              <p className="text-2xl font-bold">{profile.styleInsights.averageSentenceLength} words</p>
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Common Phrases</h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(commonPhrases) && commonPhrases.length > 0 ? (
              commonPhrases.map((phrase, index) => (
                <Badge key={index} variant="secondary">
                  {typeof phrase === "string" ? phrase : phrase.phrase}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No common phrases found</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Topic Areas</h4>
          <div className="flex flex-wrap gap-2">
            {Array.isArray(topicAreas) && topicAreas.length > 0 ? (
              topicAreas.map((topic, index) => (
                <Badge key={index} variant="outline">
                  {typeof topic === "string" ? topic : topic.topic}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No topic areas found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
