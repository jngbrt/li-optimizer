"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AIContentGenerator } from "@/components/ai-content-generator"
import type { StyleProfile } from "@/types"
import { useToast } from "@/hooks/use-toast"

interface CreatePostFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profiles, setProfiles] = useState<StyleProfile[]>([])
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true)

  const [formData, setFormData] = useState({
    content: "",
    profileId: "",
    contentType: "linkedin_post",
    goal: "thought_leadership",
    tone: "professional",
    audience: "industry_professionals",
  })

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setIsLoadingProfiles(true)
    try {
      const response = await fetch("/api/profiles")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])

        // Set default profile if available
        if (data.profiles && data.profiles.length > 0) {
          setFormData((prev) => ({ ...prev, profileId: data.profiles[0].id }))
        }
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setError("Failed to load style profiles. Please try again.")
    } finally {
      setIsLoadingProfiles(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleContentGenerated = (content: string) => {
    setFormData((prev) => ({ ...prev, content }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.content.trim()) {
      setError("Post content is required")
      return
    }

    if (!formData.profileId) {
      setError("Please select a style profile")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "user-123", // Default user ID
          ...formData,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create post")
      }

      toast({
        title: "Post Created",
        description: "Your LinkedIn post has been created successfully.",
      })

      onSuccess()
    } catch (error) {
      console.error("Error creating post:", error)
      setError(error instanceof Error ? error.message : "Failed to create post. Please try again.")

      toast({
        title: "Creation Failed",
        description: "Could not create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoadingProfiles) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No style profiles found. Please create a style profile first before creating a post.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="profileId">Style Profile</Label>
        <Select value={formData.profileId} onValueChange={(value) => handleSelectChange("profileId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select style profile" />
          </SelectTrigger>
          <SelectContent>
            {profiles.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                {profile.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.profileId && (
        <AIContentGenerator
          profileId={formData.profileId}
          profiles={profiles}
          onContentGenerated={handleContentGenerated}
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="content">Post Content</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Write your LinkedIn post content here..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contentType">Content Type</Label>
          <Select value={formData.contentType} onValueChange={(value) => handleSelectChange("contentType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
              <SelectItem value="linkedin_article">LinkedIn Article</SelectItem>
              <SelectItem value="comment">Comment/Reply</SelectItem>
              <SelectItem value="profile_summary">Profile Summary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="goal">Post Goal</Label>
          <Select value={formData.goal} onValueChange={(value) => handleSelectChange("goal", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select post goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
              <SelectItem value="network_growth">Network Growth</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="lead_generation">Lead Generation</SelectItem>
              <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
              <SelectItem value="industry_influence">Industry Influence</SelectItem>
              <SelectItem value="career_advancement">Career Advancement</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tone">Tone</Label>
          <Select value={formData.tone} onValueChange={(value) => handleSelectChange("tone", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="inspirational">Inspirational</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="authoritative">Authoritative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience">Target Audience</Label>
          <Select value={formData.audience} onValueChange={(value) => handleSelectChange("audience", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select target audience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General Network</SelectItem>
              <SelectItem value="industry_professionals">Industry Professionals</SelectItem>
              <SelectItem value="peers">Peers</SelectItem>
              <SelectItem value="executives">Executives</SelectItem>
              <SelectItem value="potential_clients">Potential Clients</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Post"
          )}
        </Button>
      </div>
    </form>
  )
}
