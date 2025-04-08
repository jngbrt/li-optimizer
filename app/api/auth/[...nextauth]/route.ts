import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Explicitly set the runtime to nodejs
export const runtime = "nodejs"

// Wrap the handler in a try-catch to ensure proper error handling
const handler = async (req: Request, context: { params: { nextauth: string[] } }) => {
  try {
    // Use the standard NextAuth handler
    const authHandler = NextAuth(authOptions)
    return await authHandler(req, context)
  } catch (error) {
    console.error("NextAuth handler error:", error)

    // Return a proper JSON error response
    return new Response(
      JSON.stringify({
        error: "Authentication error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export { handler as GET, handler as POST }
