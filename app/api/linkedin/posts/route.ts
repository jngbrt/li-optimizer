import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { fetchLinkedInPosts, saveLinkedInPosts } from "@/lib/linkedin-api"
import { analyzeWritingStyle } from "@/lib/openai"
import { saveStyleProfile, saveStyleInsights } from "@/lib/db"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify request is coming from an authenticated user
    if (!session.user?.id) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Verify the request is coming over HTTPS in production
    const url = new URL(req.url)
    if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
      return NextResponse.json({ error: "HTTPS required" }, { status: 403 })
    }

    // Fetch LinkedIn posts
    const posts = await fetchLinkedInPosts(session.accessToken, session.user.id)

    // Save posts to database
    const savedPosts = await saveLinkedInPosts(session.user.id, posts)

    // If we have enough posts, analyze the writing style
    if (savedPosts.length >= 3) {
      // Analyze writing style
      const styleInsights = await analyzeWritingStyle(savedPosts)

      // Create style profile
      const profileName = `LinkedIn Style Profile`
      const profileId = await saveStyleProfile({
        userId: session.user.id,
        name: profileName,
        description: `Style extracted from ${savedPosts.length} LinkedIn posts`,
        sampleCount: savedPosts.length,
      })

      // Save style insights
      await saveStyleInsights(profileId, styleInsights)

      return NextResponse.json({
        posts: savedPosts,
        profileCreated: true,
        profileId,
        profileName,
      })
    }

    return NextResponse.json({
      posts: savedPosts,
      profileCreated: false,
      message: savedPosts.length > 0 ? "Posts imported successfully" : "No posts found on your LinkedIn profile",
    })
  } catch (error) {
    console.error("Error fetching LinkedIn posts:", error)
    return NextResponse.json({ error: "Failed to fetch LinkedIn posts" }, { status: 500 })
  }
}
