"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, ExternalLink, Copy } from "lucide-react"
import { EditPostForm } from "./edit-post-form"
import type { GeneratedContent, StyleProfile } from "@/types"

interface PostCardProps {
  post: GeneratedContent
  profile?: StyleProfile | null
  onEdit: (post: GeneratedContent) => void
  onDelete: (id: string) => void
  onDuplicate: (post: GeneratedContent) => void
  onUpdate: () => void
}

export function PostCard({ post, profile, onEdit, onDelete, onDuplicate, onUpdate }: PostCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  const formatContentType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    onUpdate()
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">
            {post.contentType === "linkedin_post" ? "LinkedIn Post" : formatContentType(post.contentType)}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {formatContentType(post.goal)}
          </Badge>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
          {profile && <p className="text-xs text-muted-foreground">Style: {profile.name}</p>}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm whitespace-pre-line line-clamp-4">{truncateContent(post.content)}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between gap-2">
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {formatContentType(post.contentType)}
                <Badge variant="outline" className="text-xs ml-2">
                  {formatContentType(post.goal)}
                </Badge>
              </DialogTitle>
              <DialogDescription>Created on {formatDate(post.createdAt)}</DialogDescription>
            </DialogHeader>
            <div className="border rounded-md p-4 my-4 max-h-96 overflow-y-auto whitespace-pre-line">
              {post.content}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewDialogOpen(false)
                  setIsEditDialogOpen(true)
                }}
              >
                Edit Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsEditDialogOpen(true)}>
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>

          <Button variant="outline" size="sm" className="text-xs" onClick={() => onDuplicate(post)}>
            <Copy className="h-3.5 w-3.5 mr-1" />
            Duplicate
          </Button>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="text-xs">
                <Trash2 className="h-3.5 w-3.5 mr-1" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your saved post.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    setIsDeleteDialogOpen(false)
                    onDelete(post.id)
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Make changes to your LinkedIn post below.</DialogDescription>
          </DialogHeader>
          <EditPostForm post={post} onSuccess={handleEditSuccess} onCancel={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
