"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Trash2,
  RefreshCw,
  Save,
  PenTool,
  Sparkles,
  Sliders,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import type { StyleProfile, ContentSample, GenerationOptions } from "@/lib/types"
import { ContentUploader } from "@/components/content-uploader"
import { StyleProfileCard } from "@/components/style-profile-card"
import { StyleInsightsChart } from "@/components/style-insights-chart"
import { LinkedInConnector } from "@/components/linkedin-connector"
import { useCustomSession } from "@/hooks/use-custom-session"

export default function WritingAssistant() {
  const router = useRouter()
  const { data: session } = useCustomSession()
  const [activeTab, setActiveTab] = useState("upload")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadedContent, setUploadedContent] = useState<ContentSample[]>([])
  const [styleProfiles, setStyleProfiles] = useState<StyleProfile[]>([])
  const [activeProfile, setActiveProfile] = useState<StyleProfile | null>(null)
  const [generatedContent, setGeneratedContent] = useState("")
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    tone: "professional",
    audience: "industry_professionals",
    goal: "thought_leadership",
    contentType: "linkedin_post",
    length: "medium",
    includeHashtags: true,
    includeCallToAction: true,
    topicKeywords: "",
  })

  // Get user ID from session or use mock ID
  const userId = session?.user?.id || "user-123"

  // Fetch user's style profiles on component mount
  useEffect(() => {
    fetchProfiles()
  }, [userId])

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`/api/writing-assistant/profiles?userId=${userId}`)
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

  const handleContentUpload = (newContent: ContentSample[]) => {
    setUploadedContent([...uploadedContent, ...newContent])
  }

  const handleLinkedInPostsImported = (posts: ContentSample[], profileId?: string) => {
    if (profileId) {
      // If a profile was created, refresh profiles and set it as active
      fetchProfiles().then(() => {
        // Find the newly created profile and set it as active
        const profile = styleProfiles.find((p) => p.id === profileId)
        if (profile) {
          setActiveProfile(profile)
          setActiveTab("profiles")
        }
      })
    } else {
      // Otherwise, just add the posts to the uploaded content
      setUploadedContent([...uploadedContent, ...posts])
    }
  }

  const handleRemoveContent = (id: string) => {
    setUploadedContent(uploadedContent.filter((content) => content.id !== id))
  }

  const handleAnalyzeContent = async () => {
    if (uploadedContent.length === 0) return

    setIsAnalyzing(true)
    setAnalysisProgress(0)

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 1
        return newProgress >= 100 ? 100 : newProgress
      })
    }, 500)

    try {
      const response = await fetch("/api/writing-assistant/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          samples: uploadedContent,
        }),
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100)

      if (response.ok) {
        const data = await response.json()
        const newProfile = data.profile

        setStyleProfiles((prev) => [newProfile, ...prev])
        setActiveProfile(newProfile)
        setActiveTab("profiles")

        // Reset uploaded content after successful analysis
        setUploadedContent([])
      } else {
        console.error("Error analyzing content:", await response.text())
      }
    } catch (error) {
      console.error("Error analyzing content:", error)
    } finally {
      clearInterval(progressInterval)
      setIsAnalyzing(false)
    }
  }

  const handleDeleteProfile = async (id: string) => {
    try {
      const response = await fetch("/api/writing-assistant/profiles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileId: id,
        }),
      })

      if (response.ok) {
        setStyleProfiles((profiles) => profiles.filter((p) => p.id !== id))
        if (activeProfile?.id === id) {
          setActiveProfile(styleProfiles.length > 1 ? styleProfiles.find((p) => p.id !== id) || null : null)
        }
      }
    } catch (error) {
      console.error("Error deleting profile:", error)
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
          userId,
          profileId: activeProfile.id,
          options: generationOptions,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedContent(data.content)
        setActiveTab("generate")
      } else {
        console.error("Error generating content:", await response.text())
      }
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveToEditor = () => {
    // In a real implementation, this would save to your state management
    // and redirect to the main editor
    localStorage.setItem("draftPost", generatedContent)
    router.push("/")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-2">Personal Writing Assistant</h1>
      <p className="text-center text-muted-foreground mb-10">
        Train the AI to write in your unique style for authentic LinkedIn content
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-5xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="profiles">Style Profiles</TabsTrigger>
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Your Content</CardTitle>
                <CardDescription>Provide samples of your writing to train the AI on your unique style</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ContentUploader userId={userId} onUpload={handleContentUpload} />

                {uploadedContent.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Uploaded Content ({uploadedContent.length})</h3>
                      <Button variant="ghost" size="sm" onClick={() => setUploadedContent([])} className="h-8 text-xs">
                        Clear All
                      </Button>
                    </div>

                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <div className="space-y-4">
                        {uploadedContent.map((content) => (
                          <div key={content.id} className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-medium text-sm">{content.title || "Untitled Content"}</p>
                                <p className="text-xs text-muted-foreground">
                                  {content.contentType} • {content.wordCount} words
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveContent(content.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analyzing your writing style...</span>
                      <span className="text-sm font-medium">{analysisProgress}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={uploadedContent.length === 0 || isAnalyzing}
                  onClick={handleAnalyzeContent}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <PenTool className="mr-2 h-4 w-4" />
                      Analyze My Writing Style
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <LinkedInConnector onPostsImported={handleLinkedInPostsImported} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Best Results</CardTitle>
              <CardDescription>How to get the most accurate style analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Upload at least 3-5 samples of your writing for best results</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Include content that represents your professional voice</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Mix different types of content (articles, posts, etc.)</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm">Longer samples provide more accurate style analysis</span>
                </li>
                <li className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <span className="text-sm">Avoid including sensitive or confidential information</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          {styleProfiles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {styleProfiles.map((profile) => (
                  <StyleProfileCard
                    key={profile.id}
                    profile={profile}
                    isActive={activeProfile?.id === profile.id}
                    onSelect={() => setActiveProfile(profile)}
                    onDelete={() => handleDeleteProfile(profile.id)}
                  />
                ))}
              </div>

              {activeProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle>Style Insights: {activeProfile.name}</CardTitle>
                    <CardDescription>Detailed analysis of your writing style</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Tone Distribution</h3>
                        <StyleInsightsChart
                          data={[
                            { name: "Formal", value: activeProfile.styleInsights.toneDistribution.formal },
                            {
                              name: "Conversational",
                              value: activeProfile.styleInsights.toneDistribution.conversational,
                            },
                            {
                              name: "Inspirational",
                              value: activeProfile.styleInsights.toneDistribution.inspirational,
                            },
                          ]}
                        />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-3">Sentence Structure</h3>
                        <StyleInsightsChart
                          data={[
                            { name: "Simple", value: activeProfile.styleInsights.sentenceStructure.simple },
                            { name: "Compound", value: activeProfile.styleInsights.sentenceStructure.compound },
                            { name: "Complex", value: activeProfile.styleInsights.sentenceStructure.complex },
                          ]}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-medium">Vocabulary Level</h3>
                          <span className="text-sm font-medium">{activeProfile.styleInsights.vocabularyLevel}/100</span>
                        </div>
                        <Progress value={activeProfile.styleInsights.vocabularyLevel} className="h-2" />
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-2">Average Sentence Length</h3>
                        <p className="text-2xl font-bold">{activeProfile.styleInsights.averageSentenceLength} words</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Common Phrases</h3>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.styleInsights.commonPhrases.map((phrase, index) => (
                            <div
                              key={index}
                              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                            >
                              {phrase}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Topic Areas</h3>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.styleInsights.topicAreas.map((topic, index) => (
                            <div key={index} className="border border-input px-2 py-1 rounded-md text-xs">
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setActiveTab("generate")}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Content with This Style
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PenTool className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Style Profiles Yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Upload your content samples to create your first writing style profile.
                </p>
                <Button onClick={() => setActiveTab("upload")}>Upload Content</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          {activeProfile ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Generation Options</CardTitle>
                    <CardDescription>Customize your content while maintaining your style</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="content-type" className="text-sm font-medium">
                        Content Type
                      </label>
                      <Select
                        value={generationOptions.contentType}
                        onValueChange={(value) => setGenerationOptions({ ...generationOptions, contentType: value })}
                      >
                        <SelectTrigger id="content-type">
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
                      <label htmlFor="goal" className="text-sm font-medium">
                        Content Goal
                      </label>
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
                      <label htmlFor="tone" className="text-sm font-medium">
                        Tone Adjustment
                      </label>
                      <Select
                        value={generationOptions.tone}
                        onValueChange={(value) => setGenerationOptions({ ...generationOptions, tone: value })}
                      >
                        <SelectTrigger id="tone">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="conversational">Conversational</SelectItem>
                          <SelectItem value="inspirational">Inspirational</SelectItem>
                          <SelectItem value="authoritative">Authoritative</SelectItem>
                          <SelectItem value="educational">Educational</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="audience" className="text-sm font-medium">
                        Target Audience
                      </label>
                      <Select
                        value={generationOptions.audience}
                        onValueChange={(value) => setGenerationOptions({ ...generationOptions, audience: value })}
                      >
                        <SelectTrigger id="audience">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="industry_professionals">Industry Professionals</SelectItem>
                          <SelectItem value="executives">Executives & Decision Makers</SelectItem>
                          <SelectItem value="peers">Peers & Colleagues</SelectItem>
                          <SelectItem value="potential_clients">Potential Clients</SelectItem>
                          <SelectItem value="general">General Professional Network</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="length" className="text-sm font-medium">
                        Content Length
                      </label>
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

                    <div className="space-y-2">
                      <label htmlFor="topic-keywords" className="text-sm font-medium">
                        Topic Keywords
                      </label>
                      <Textarea
                        id="topic-keywords"
                        placeholder="Enter keywords or topics to focus on..."
                        value={generationOptions.topicKeywords}
                        onChange={(e) => setGenerationOptions({ ...generationOptions, topicKeywords: e.target.value })}
                        className="resize-none h-20"
                      />
                    </div>

                    <hr className="my-2" />

                    <div className="flex items-center justify-between">
                      <label htmlFor="include-hashtags" className="text-sm font-medium cursor-pointer">
                        Include Hashtags
                      </label>
                      <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary">
                        <div
                          className={`${
                            generationOptions.includeHashtags
                              ? "translate-x-4 bg-white"
                              : "translate-x-0 bg-muted-foreground"
                          } h-3 w-3 rounded-full transition-transform`}
                          onClick={() =>
                            setGenerationOptions({
                              ...generationOptions,
                              includeHashtags: !generationOptions.includeHashtags,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label htmlFor="include-cta" className="text-sm font-medium cursor-pointer">
                        Include Call to Action
                      </label>
                      <div className="relative inline-flex h-4 w-8 items-center rounded-full bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary">
                        <div
                          className={`${
                            generationOptions.includeCallToAction
                              ? "translate-x-4 bg-white"
                              : "translate-x-0 bg-muted-foreground"
                          } h-3 w-3 rounded-full transition-transform`}
                          onClick={() =>
                            setGenerationOptions({
                              ...generationOptions,
                              includeCallToAction: !generationOptions.includeCallToAction,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={handleGenerateContent} disabled={isGenerating}>
                      {isGenerating ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate in My Style
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Generated Content</span>
                      <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
                        Using: {activeProfile.name}
                      </div>
                    </CardTitle>
                    <CardDescription>Content written in your personal style</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={generatedContent}
                      onChange={(e) => setGeneratedContent(e.target.value)}
                      placeholder="Your personalized content will appear here after generation..."
                      className="min-h-[300px] font-medium"
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleGenerateContent} disabled={isGenerating}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Regenerate
                    </Button>
                    <Button onClick={handleSaveToEditor} disabled={!generatedContent}>
                      <Save className="mr-2 h-4 w-4" />
                      Use in Post Editor
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertTitle>Style Matching</AlertTitle>
                <AlertDescription>
                  The generated content maintains your unique writing style while adapting to your selected options. You
                  can edit the content directly or regenerate with different settings.
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Sliders className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Active Style Profile</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Select or create a writing style profile to generate personalized content.
                </p>
                <Button onClick={() => setActiveTab("profiles")}>Select Style Profile</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
