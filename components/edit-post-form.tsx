"use client"

import type React from "react"

import { useState } from "react"
import type { Post, StyleProfile } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface EditPostFormProps {
  post: Post
  profiles: StyleProfile[]
  onSuccess: () => void
  onCancel: () => void
}

export function EditPostForm({ post, profiles, onSuccess, onCancel }: EditPostFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    content: post.content,
    contentType: post.contentType,
    goal: post.goal,
    tone: post.tone,
    audience: post.audience,
    profileId: post.profileId,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update post")
      }

      onSuccess()
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Enter your post content"
            className="min-h-[200px]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <Label htmlFor="goal">Goal</Label>
            <Select value={formData.goal} onValueChange={(value) => handleSelectChange("goal", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select goal" />
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
                <SelectValue placeholder="Select audience" />
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
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}
