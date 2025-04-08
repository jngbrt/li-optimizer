"use client"

import { useState, useEffect } from "react"
import type { Post, StyleProfile } from "@/types"
import { formatDate, truncateText, formatContentType } from "@/lib/db-utils"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Pencil, Trash2, RefreshCw, Search, Filter } from "lucide-react"
import { PostDetail } from "@/components/post-detail"
import { EditPostForm } from "@/components/edit-post-form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreatePostForm } from "@/components/create-post-form"
import { PlusCircle } from "lucide-react"

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [profiles, setProfiles] = useState<StyleProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileFilter, setProfileFilter] = useState("all")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [goalFilter, setGoalFilter] = useState("all")
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchPosts()
    fetchProfiles()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/posts")
      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      } else {
        console.error("Error response from posts API:", await response.text())
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      } else {
        console.error("Error response from profiles API:", await response.text())
        setProfiles([])
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setProfiles([])
    }
  }

  const handleViewPost = (post: Post) => {
    setSelectedPost(post)
    setIsViewDialogOpen(true)
  }

  const handleEditPost = (post: Post) => {
    setSelectedPost(post)
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch(`/api/posts/${postToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postToDelete))
        setIsDeleteDialogOpen(false)
        setPostToDelete(null)
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false)
    fetchPosts() // Refresh the posts list
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    fetchPosts() // Refresh the posts list
  }

  const filteredPosts = posts.filter((post) => {
    let matches = true

    if (profileFilter !== "all") {
      matches = matches && post.profileId === profileFilter
    }

    if (contentTypeFilter !== "all") {
      matches = matches && post.contentType === contentTypeFilter
    }

    if (goalFilter !== "all") {
      matches = matches && post.goal === goalFilter
    }

    if (searchQuery.trim()) {
      matches = matches && post.content.toLowerCase().includes(searchQuery.toLowerCase())
    }

    return matches
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="md:w-auto w-full mb-2 md:mb-0">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Post
        </Button>
        <div className="flex flex-col md:flex-row gap-2">
          <Select value={profileFilter} onValueChange={setProfileFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Style Profile</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Content Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="linkedin_post">LinkedIn Post</SelectItem>
              <SelectItem value="linkedin_article">LinkedIn Article</SelectItem>
              <SelectItem value="comment">Comment/Reply</SelectItem>
            </SelectContent>
          </Select>

          <Select value={goalFilter} onValueChange={setGoalFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Post Goal</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
              <SelectItem value="network_growth">Network Growth</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="lead_generation">Lead Generation</SelectItem>
              <SelectItem value="brand_awareness">Brand Awareness</SelectItem>
              <SelectItem value="industry_influence">Industry Influence</SelectItem>
              <SelectItem value="career_advancement">Career Advancement</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={fetchPosts} className="md:ml-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-4"></div>
          <p>Loading posts...</p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{formatContentType(post.contentType)}</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {formatContentType(post.goal)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{formatDate(post.createdAt)}</p>
                  {post.profile && <p className="text-xs text-muted-foreground">Style: {post.profile.name}</p>}
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm whitespace-pre-line line-clamp-4">{truncateText(post.content)}</p>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline" size="sm" onClick={() => handleViewPost(post)}>
                  View
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(post.id)}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {posts.length === 0
              ? "No posts have been created yet."
              : "No posts match your current filters. Try adjusting your search criteria."}
          </p>
          {(searchQuery || profileFilter !== "all" || contentTypeFilter !== "all" || goalFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setProfileFilter("all")
                setContentTypeFilter("all")
                setGoalFilter("all")
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
          </DialogHeader>
          {selectedPost && <PostDetail post={selectedPost} />}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <EditPostForm
              post={selectedPost}
              profiles={profiles}
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New LinkedIn Post</DialogTitle>
          </DialogHeader>
          <CreatePostForm onSuccess={handleCreateSuccess} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
