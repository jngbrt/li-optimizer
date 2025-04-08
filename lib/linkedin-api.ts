import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

const sql = neon(process.env.DATABASE_URL!)

// LinkedIn API endpoints
const LINKEDIN_API_URL = "https://api.linkedin.com/v2"

// Fetch user's LinkedIn profile
export async function fetchLinkedInProfile(accessToken: string) {
  try {
    const response = await fetch(`${LINKEDIN_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching LinkedIn profile:", error)
    throw error
  }
}

// Fetch user's LinkedIn posts
export async function fetchLinkedInPosts(accessToken: string, userId: string) {
  try {
    // In a real implementation, you would use the LinkedIn API to fetch posts
    // LinkedIn's API for fetching posts is complex and requires specific permissions
    // This is a simplified version that would need to be expanded based on LinkedIn's API documentation

    const response = await fetch(`${LINKEDIN_API_URL}/ugcPosts?q=authors&authors=List(${userId})`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
      },
    })

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`)
    }

    const data = await response.json()
    return data.elements || []
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error)
    throw error
  }
}

// Save LinkedIn posts to database
export async function saveLinkedInPosts(userId: string, posts: any[]) {
  try {
    const savedPosts = []

    for (const post of posts) {
      const content = post.specificContent?.["com.linkedin.ugc.ShareContent"]?.shareCommentary?.text || ""

      if (content) {
        const wordCount = content.split(/\s+/).filter(Boolean).length

        const id = uuidv4()
        await sql`
          INSERT INTO content_samples (
            id, user_id, title, content, content_type, word_count, source, source_url
          ) VALUES (
            ${id}, ${userId}, ${"LinkedIn Post"}, ${content}, ${"linkedin_post"}, ${wordCount}, ${"linkedin"}, ${post.id}
          )
        `

        savedPosts.push({
          id,
          userId,
          title: "LinkedIn Post",
          content,
          contentType: "linkedin_post",
          wordCount,
          source: "linkedin",
          sourceUrl: post.id,
        })
      }
    }

    return savedPosts
  } catch (error) {
    console.error("Error saving LinkedIn posts:", error)
    throw error
  }
}
