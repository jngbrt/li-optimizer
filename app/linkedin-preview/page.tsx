"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RefreshCw, Sparkles, Upload } from "lucide-react"
import type { StyleProfile, GenerationOptions } from "@/lib/types"
import { LinkedInPostPreview } from "@/components/linkedin-post-preview"
import { PostHistoryTab } from "@/components/post-history-tab"

// Mock user ID - in a real app, this would come from authentication
const MOCK_USER_ID = "user-123"

export default function LinkedInPreviewPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [isGenerating, setIsGenerating] = useState(false)
  const [styleProfiles, setStyleProfiles] = useState<StyleProfile[]>([])
  const [activeProfile, setActiveProfile] = useState<StyleProfile | null>(null)
  const [postContent, setPostContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState({
    name: "Jane Smith",
    title: "Digital Transformation Consultant",
    avatarUrl: "/placeholder.svg?height=100&width=100",
  })
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    tone: "professional",
    audience: "industry_professionals",
    goal: "thought_leadership",
    contentType: "linkedin_post",
    length: "medium",
    includeHashtags: true,
    includeCallToAction: true,
    topicKeywords: "digital transformation, leadership, innovation",
  })

  // Fetch user's style profiles on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch(`/api/writing-assistant/profiles?userId=${MOCK_USER_ID}`)
        if (response.ok) {
          const data = await response.json()
          setStyleProfiles(data.profiles || [])
          if (data.profiles && data.profiles.length > 0) {
            setActiveProfile(data.profiles[0])
          }
        }
      } catch (error) {
        console.error("Error fetching style profiles:", error)
      }
    }

    fetchProfiles()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleGenerateContent = async () => {
    if (!activeProfile) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/writing-assistant/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: MOCK_USER_ID,
          profileId: activeProfile.id,
          options: generationOptions,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setPostContent(data.content)
        setActiveTab("preview")
      } else {
        console.error("Error generating content:", await response.text())
      }
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-2">LinkedIn Post Preview</h1>
      <p className="text-center text-muted-foreground mb-10">
        Create and preview personalized LinkedIn posts in your unique writing style
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Post</TabsTrigger>
          <TabsTrigger value="preview">LinkedIn Preview</TabsTrigger>
          <TabsTrigger value="history">Post History</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Customize how you appear on LinkedIn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
                    <AvatarFallback>
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Input
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      className="mb-2"
                    />
                    <Input
                      value={userProfile.title}
                      onChange={(e) => setUserProfile({ ...userProfile, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="style-profile">Writing Style Profile</Label>
                  <Select
                    value={activeProfile?.id}
                    onValueChange={(value) => {
                      const profile = styleProfiles.find((p) => p.id === value)
                      if (profile) setActiveProfile(profile)
                    }}
                  >
                    <SelectTrigger id="style-profile">
                      <SelectValue placeholder="Select your writing style" />
                    </SelectTrigger>
                    <SelectContent>
                      {styleProfiles.map((profile) => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeProfile && (
                  <div className="space-y-2">
                    <Label>Style Characteristics</Label>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span>Tone:</span>
                        <span className="font-medium">
                          {activeProfile.styleInsights.toneDistribution.formal > 50
                            ? "Formal"
                            : activeProfile.styleInsights.toneDistribution.conversational > 50
                              ? "Conversational"
                              : "Balanced"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vocabulary:</span>
                        <span className="font-medium">
                          {activeProfile.styleInsights.vocabularyLevel > 75
                            ? "Advanced"
                            : activeProfile.styleInsights.vocabularyLevel > 50
                              ? "Professional"
                              : "Accessible"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sentence Length:</span>
                        <span className="font-medium">{activeProfile.styleInsights.averageSentenceLength} words</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Post Content</CardTitle>
                <CardDescription>Generate content in your personal style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic-keywords">Topic Keywords</Label>
                  <Input
                    id="topic-keywords"
                    placeholder="Enter keywords or topics to focus on..."
                    value={generationOptions.topicKeywords}
                    onChange={(e) => setGenerationOptions({ ...generationOptions, topicKeywords: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal">Content Goal</Label>
                    <Select
                      value={generationOptions.goal}
                      onValueChange={(value) => setGenerationOptions({ ...generationOptions, goal: value })}
                    >
                      <SelectTrigger id="goal">
                        <SelectValue placeholder="Select content goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
                        <SelectItem value="network_growth">Network Growth</SelectItem>
                        <SelectItem value="engagement">Maximize Engagement</SelectItem>
                        <SelectItem value="lead_generation">Generate Leads</SelectItem>
                        <SelectItem value="brand_awareness">Personal Branding</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="length">Content Length</Label>
                    <Select
                      value={generationOptions.length}
                      onValueChange={(value) => setGenerationOptions({ ...generationOptions, length: value })}
                    >
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (~100 words)</SelectItem>
                        <SelectItem value="medium">Medium (~200 words)</SelectItem>
                        <SelectItem value="long">Long (~350 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-hashtags" className="cursor-pointer">
                      Include Hashtags
                    </Label>
                    <Switch
                      id="include-hashtags"
                      checked={generationOptions.includeHashtags}
                      onCheckedChange={(checked) =>
                        setGenerationOptions({ ...generationOptions, includeHashtags: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-cta" className="cursor-pointer">
                      Include Call to Action
                    </Label>
                    <Switch
                      id="include-cta"
                      checked={generationOptions.includeCallToAction}
                      onCheckedChange={(checked) =>
                        setGenerationOptions({ ...generationOptions, includeCallToAction: checked })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="post-content">Your Post</Label>
                  <Textarea
                    id="post-content"
                    placeholder="Generate content or write your own..."
                    className="min-h-[200px]"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Add Image (Optional)</Label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative w-24 h-24 rounded-md overflow-hidden">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : null}
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex gap-2 items-center border rounded-md px-3 py-2 hover:bg-accent"
                    >
                      <Upload className="h-4 w-4" />
                      {imageFile ? "Change Image" : "Upload Image"}
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("preview")} disabled={!postContent.trim()}>
                  Preview Post
                </Button>
                <Button onClick={handleGenerateContent} disabled={!activeProfile || isGenerating} className="gap-2">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate in My Style
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="max-w-xl mx-auto">
            <LinkedInPostPreview user={userProfile} content={postContent} imageUrl={imagePreview} />

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("create")}>
                Edit Post
              </Button>
              <Button
                onClick={async () => {
                  if (!activeProfile || !postContent.trim()) return

                  try {
                    const response = await fetch("/api/writing-assistant/history", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        userId: MOCK_USER_ID,
                        profileId: activeProfile.id,
                        content: postContent,
                        contentType: "linkedin_post",
                        goal: generationOptions.goal,
                        tone: generationOptions.tone,
                        audience: generationOptions.audience,
                      }),
                    })

                    if (response.ok) {
                      setActiveTab("history")
                    }
                  } catch (error) {
                    console.error("Error saving to history:", error)
                  }
                }}
              >
                Save to History
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <PostHistoryTab
            userId={MOCK_USER_ID}
            onEditPost={(post) => {
              setPostContent(post.content)
              setActiveTab("create")
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
