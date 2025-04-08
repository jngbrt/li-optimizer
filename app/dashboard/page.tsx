"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCustomSession } from "@/hooks/use-custom-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Linkedin, PenTool, FileText } from "lucide-react"

export default function Dashboard() {
  const { data: session, status } = useCustomSession()
  const router = useRouter()

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Welcome to LinkedIn Optimizer</h1>
      <p className="text-muted-foreground mb-10">Your LinkedIn account is connected. Get started with these options:</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Linkedin className="h-5 w-5 text-[#0077B5]" />
              Import LinkedIn Posts
            </CardTitle>
            <CardDescription>Analyze your existing LinkedIn posts to create a style profile</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We'll fetch your LinkedIn posts and analyze them to understand your unique writing style.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/writing-assistant")} className="w-full">
              Import and Analyze
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Create New Content
            </CardTitle>
            <CardDescription>Generate new LinkedIn posts in your personal style</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use AI to create engaging LinkedIn posts that match your authentic voice and writing style.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/writing-assistant?tab=generate")} className="w-full">
              Create Content
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Manage Posts
            </CardTitle>
            <CardDescription>View and manage your saved LinkedIn posts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access your saved posts, edit them, or create new ones based on your existing content.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push("/")} className="w-full">
              View Posts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
