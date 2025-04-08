import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user-123" // Default to our sample user
    const profileId = searchParams.get("profileId")
    const contentType = searchParams.get("contentType")
    const goal = searchParams.get("goal")
    const search = searchParams.get("search")

    // Build the query with filters
    let query = `
      SELECT 
        gc.*, 
        sp.name as profile_name,
        sp.description as profile_description
      FROM generated_content gc
      LEFT JOIN style_profiles sp ON gc.profile_id = sp.id
      WHERE gc.user_id = $1
    `

    const params = [userId]
    let paramIndex = 2

    if (profileId) {
      query += ` AND gc.profile_id = $${paramIndex}`
      params.push(profileId)
      paramIndex++
    }

    if (contentType) {
      query += ` AND gc.content_type = $${paramIndex}`
      params.push(contentType)
      paramIndex++
    }

    if (goal) {
      query += ` AND gc.goal = $${paramIndex}`
      params.push(goal)
      paramIndex++
    }

    if (search) {
      query += ` AND gc.content ILIKE $${paramIndex}`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY gc.created_at DESC`

    const result = await sql.query(query, params)

    // Handle the response properly, ensuring we have an array to map over
    const posts = Array.isArray(result)
      ? result
      : result.rows
        ? result.rows
        : Array.isArray(result.data)
          ? result.data
          : []

    return NextResponse.json({
      posts: posts.map((post) => ({
        id: post.id,
        userId: post.user_id,
        profileId: post.profile_id,
        content: post.content,
        contentType: post.content_type,
        goal: post.goal,
        tone: post.tone,
        audience: post.audience,
        createdAt: post.created_at,
        profile: {
          name: post.profile_name,
          description: post.profile_description,
        },
      })),
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, userId, profileId, content, contentType, goal, tone, audience } = body

    if (!userId || !profileId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use the provided ID or generate a new one
    const postId = id || uuidv4()

    await sql`
      INSERT INTO generated_content (
        id, user_id, profile_id, content, content_type, goal, tone, audience, created_at
      ) VALUES (
        ${postId}, ${userId}, ${profileId}, ${content}, ${contentType}, ${goal}, ${tone}, ${audience}, NOW()
      )
    `

    return NextResponse.json({ success: true, id: postId })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
