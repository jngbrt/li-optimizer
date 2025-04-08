"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, MessageCircle, Share2, Send } from "lucide-react"

interface LinkedInPostPreviewProps {
  user: {
    name: string
    title: string
    avatarUrl: string
  }
  content: string
  imageUrl: string | null
}

export function LinkedInPostPreview({ user, content, imageUrl }: LinkedInPostPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [commentCount, setCommentCount] = useState(0)

  // Format the content with line breaks
  const formattedContent = content.replace(/\n/g, "<br />")

  // Check if content is long enough to need expansion
  const needsExpansion = (content.match(/\n/g) || []).length > 5

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <Card className="max-w-xl mx-auto shadow-md">
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.title}</p>
              <p className="text-xs text-muted-foreground">1h</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div
            className={`whitespace-pre-wrap ${needsExpansion && !isExpanded ? "line-clamp-5" : ""}`}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {needsExpansion && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-primary hover:underline mt-1">
              {isExpanded ? "See less" : "See more"}
            </button>
          )}
        </div>

        {imageUrl && (
          <div className="border-t border-b">
            <img src={imageUrl || "/placeholder.svg"} alt="Post image" className="w-full object-cover max-h-[300px]" />
          </div>
        )}

        <div className="px-4 py-2 flex items-center justify-between border-t">
          <div className="flex items-center gap-1">
            <div className="bg-primary text-primary-foreground rounded-full p-1 h-5 w-5 flex items-center justify-center">
              <ThumbsUp className="h-3 w-3" />
            </div>
            <span className="text-xs text-muted-foreground">{likeCount > 0 ? likeCount : ""}</span>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span>{commentCount > 0 ? `${commentCount} comments` : ""}</span>
          </div>
        </div>

        <div className="p-1 flex items-center justify-around border-t">
          <Button
            variant="ghost"
            size="sm"
            className={`flex gap-2 ${isLiked ? "text-primary" : ""}`}
            onClick={handleLike}
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs">Like</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex gap-2">
            <Send className="h-4 w-4" />
            <span className="text-xs">Send</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
