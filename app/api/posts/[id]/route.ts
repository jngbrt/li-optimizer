import { NextResponse } from "next/server"
import { sql } from "@/lib/db-utils"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await sql`
      SELECT 
        gc.*, 
        sp.name as profile_name,
        sp.description as profile_description
      FROM generated_content gc
      LEFT JOIN style_profiles sp ON gc.profile_id = sp.id
      WHERE gc.id = ${id}
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    const post = result.rows[0]
    return NextResponse.json({
      post: {
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
      },
    })
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { content, contentType, goal, tone, audience } = body

    // Build the SET clause dynamically
    const updates = []
    const values = []
    let paramIndex = 1

    if (content !== undefined) {
      updates.push(`content = $${paramIndex}`)
      values.push(content)
      paramIndex++
    }

    if (contentType !== undefined) {
      updates.push(`content_type = $${paramIndex}`)
      values.push(contentType)
      paramIndex++
    }

    if (goal !== undefined) {
      updates.push(`goal = $${paramIndex}`)
      values.push(goal)
      paramIndex++
    }

    if (tone !== undefined) {
      updates.push(`tone = $${paramIndex}`)
      values.push(tone)
      paramIndex++
    }

    if (audience !== undefined) {
      updates.push(`audience = $${paramIndex}`)
      values.push(audience)
      paramIndex++
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    updates.push(`updated_at = NOW()`)

    // Add the ID parameter
    values.push(id)

    const query = `
      UPDATE generated_content
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.query(query, values)

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await sql`
      DELETE FROM generated_content
      WHERE id = ${id}
    `

    if (result.count === 0) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
