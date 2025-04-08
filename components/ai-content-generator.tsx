"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { StyleProfile } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface AIContentGeneratorProps {
  profileId: string
  profiles: StyleProfile[]
  onContentGenerated: (content: string) => void
}

export function AIContentGenerator({ profileId, profiles, onContentGenerated }: AIContentGeneratorProps) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  const [topic, setTopic] = useState("")
  const [error, setError] = useState<string | null>(null)

  const selectedProfile = profiles.find((p) => p.id === profileId)

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic for your post")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId,
          topic: topic.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }

      const data = await response.json()
      onContentGenerated(data.content)

      toast({
        title: "Content Generated",
        description: "AI-generated content is ready for your review.",
      })
    } catch (error) {
      console.error("Error generating content:", error)
      setError(error instanceof Error ? error.message : "Failed to generate content. Please try again.")

      toast({
        title: "Generation Failed",
        description: "Could not generate content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4 border rounded-md p-4 bg-muted/20">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">AI Content Generator</h3>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="topic">What topic would you like to write about?</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., digital transformation, leadership, industry trends"
          disabled={isGenerating}
        />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="gap-2">
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
