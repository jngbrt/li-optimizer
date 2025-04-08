import type { Post } from "@/types"
import { formatDate, formatContentType } from "@/lib/db-utils"
import { Badge } from "@/components/ui/badge"

interface PostDetailProps {
  post: Post
}

export function PostDetail({ post }: PostDetailProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Badge>{formatContentType(post.contentType)}</Badge>
        <Badge variant="outline">{formatContentType(post.goal)}</Badge>
        <Badge variant="secondary">{formatContentType(post.tone)}</Badge>
        <Badge variant="secondary">{formatContentType(post.audience)}</Badge>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground">
        <div>Created: {formatDate(post.createdAt)}</div>
        {post.profile && <div>Style: {post.profile.name}</div>}
      </div>

      <div className="border rounded-md p-4 whitespace-pre-line">{post.content}</div>
    </div>
  )
}
