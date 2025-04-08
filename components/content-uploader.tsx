"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Link, Clipboard } from "lucide-react"
import type { ContentSample } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

interface ContentUploaderProps {
  userId: string
  onUpload: (content: ContentSample[]) => void
}

export function ContentUploader({ userId, onUpload }: ContentUploaderProps) {
  const [activeTab, setActiveTab] = useState("paste")
  const [pastedContent, setPastedContent] = useState("")
  const [contentTitle, setContentTitle] = useState("")
  const [contentType, setContentType] = useState("linkedin_post")
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePasteUpload = () => {
    if (!pastedContent.trim()) return

    const wordCount = pastedContent.split(/\s+/).filter(Boolean).length

    const newContent: ContentSample = {
      id: uuidv4(),
      userId,
      title: contentTitle || `Pasted Content (${new Date().toLocaleDateString()})`,
      content: pastedContent,
      contentType,
      wordCount,
      source: "paste",
    }

    onUpload([newContent])
    setPastedContent("")
    setContentTitle("")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    const contentPromises = files.map((file) => {
      return new Promise<ContentSample>((resolve) => {
        const reader = new FileReader()

        reader.onload = (event) => {
          const content = event.target?.result as string
          const wordCount = content.split(/\s+/).filter(Boolean).length

          resolve({
            id: uuidv4(),
            userId,
            title: file.name,
            content,
            contentType: getContentTypeFromFileName(file.name),
            wordCount,
            source: "file",
          })
        }

        reader.readAsText(file)
      })
    })

    Promise.all(contentPromises).then((contents) => {
      onUpload(contents)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    })
  }

  const handleUrlUpload = async () => {
    if (!url.trim() || !url.startsWith("http")) return

    setIsLoading(true)

    try {
      // In a real implementation, this would fetch the content from the URL
      // For demo purposes, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const simulatedContent =
        "This is simulated content from a URL. In a real implementation, this would be the actual content fetched from the provided URL. The content would then be analyzed to understand the writing style, tone, vocabulary, and sentence structure."
      const wordCount = simulatedContent.split(/\s+/).filter(Boolean).length

      const newContent: ContentSample = {
        id: uuidv4(),
        userId,
        title: `Content from ${new URL(url).hostname}`,
        content: simulatedContent,
        contentType,
        wordCount,
        source: "url",
        sourceUrl: url,
      }

      onUpload([newContent])
      setUrl("")
    } catch (error) {
      console.error("Error fetching URL content:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getContentTypeFromFileName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "md":
        return "article"
      case "txt":
        return "text"
      case "docx":
      case "doc":
        return "document"
      default:
        return "linkedin_post"
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="paste">Paste Content</TabsTrigger>
        <TabsTrigger value="file">Upload File</TabsTrigger>
        <TabsTrigger value="url">From URL</TabsTrigger>
      </TabsList>

      <TabsContent value="paste" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content-title">Title (Optional)</Label>
          <Input
            id="content-title"
            placeholder="Give your content a name"
            value={contentTitle}
            onChange={(e) => setContentTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content-type">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger id="content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="blog_post">Blog Post</SelectItem>
              <SelectItem value="email">Professional Email</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pasted-content">Your Content</Label>
          <Textarea
            id="pasted-content"
            placeholder="Paste your content here..."
            className="min-h-[200px]"
            value={pastedContent}
            onChange={(e) => setPastedContent(e.target.value)}
          />
        </div>

        <Button onClick={handlePasteUpload} disabled={!pastedContent.trim()} className="w-full">
          <Clipboard className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </TabsContent>

      <TabsContent value="file" className="space-y-4">
        <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Upload Text Files</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop or click to upload .txt, .md, or .docx files
          </p>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.docx,.doc"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            id="file-upload"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <FileText className="mr-2 h-4 w-4" />
            Select Files
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Supported file types: .txt, .md, .docx, .doc</p>
        </div>
      </TabsContent>

      <TabsContent value="url" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content-url">Content URL</Label>
          <div className="flex gap-2">
            <Input
              id="content-url"
              placeholder="https://example.com/your-article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleUrlUpload} disabled={!url.trim() || !url.startsWith("http") || isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Fetching...
                </span>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  Fetch
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="url-content-type">Content Type</Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger id="url-content-type">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="blog_post">Blog Post</SelectItem>
              <SelectItem value="web_page">Web Page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Enter the URL of your published content to analyze its style</p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
