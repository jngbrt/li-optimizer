"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { HistoryPostCard } from "@/components/history-post-card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { History, Search, MessageSquare, Filter } from "lucide-react"
import type { GeneratedContent } from "@/lib/types"

interface PostHistoryTabProps {
  userId: string
  onEditPost: (post: GeneratedContent) => void
}

export function PostHistoryTab({ userId, onEditPost }: PostHistoryTabProps) {
  const [posts, setPosts] = useState<GeneratedContent[]>([])
  const [filteredPosts, setFilteredPosts] = useState<GeneratedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [goalFilter, setGoalFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchPosts()
  }, [userId])

  useEffect(() => {
    filterPosts()
  }, [posts, searchQuery, contentTypeFilter, goalFilter, activeTab])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/writing-assistant/history?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setPosts(data.history || [])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeletePost = async (id: string) => {
    try {
      const response = await fetch(`/api/writing-assistant/history/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleDuplicatePost = async (post: GeneratedContent) => {
    try {
      const response = await fetch("/api/writing-assistant/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: post.userId,
          profileId: post.profileId,
          content: post.content,
          contentType: post.contentType,
          goal: post.goal,
          tone: post.tone,
          audience: post.audience,
        }),
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error("Error duplicating post:", error)
    }
  }

  const filterPosts = () => {
    let filtered = [...posts]

    // Filter by tab (recency)
    if (activeTab === "recent") {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      filtered = filtered.filter((post) => new Date(post.createdAt) >= oneWeekAgo)
    }

    // Filter by content type
    if (contentTypeFilter !== "all") {
      filtered = filtered.filter((post) => post.contentType === contentTypeFilter)
    }

    // Filter by goal
    if (goalFilter !== "all") {
      filtered = filtered.filter((post) => post.goal === goalFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((post) => post.content.toLowerCase().includes(query))
    }

    setFilteredPosts(filtered)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Your Post History
            </CardTitle>
            <CardDescription>Previously generated and saved LinkedIn posts</CardDescription>
          </div>
          <Button variant="outline" className="mt-2 md:mt-0" size="sm" onClick={fetchPosts}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full max-w-xs">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="recent">Recent (7 days)</TabsTrigger>
          </TabsList>
        </Tabs>

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
          <div className="flex gap-2">
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
                <SelectItem value="profile_summary">Profile Summary</SelectItem>
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
                <SelectItem value="engagement">Maximize Engagement</SelectItem>
                <SelectItem value="lead_generation">Generate Leads</SelectItem>
                <SelectItem value="brand_awareness">Personal Branding</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-4"></div>
            <p>Loading your post history...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <HistoryPostCard
                key={post.id}
                post={post}
                onEdit={onEditPost}
                onDelete={handleDeletePost}
                onDuplicate={handleDuplicatePost}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-6">
              {posts.length === 0
                ? "You haven't created any posts yet. Generate your first post to see it here."
                : "No posts match your current filters. Try adjusting your search criteria."}
            </p>
            {searchQuery || contentTypeFilter !== "all" || goalFilter !== "all" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setContentTypeFilter("all")
                  setGoalFilter("all")
                }}
              >
                Clear Filters
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
