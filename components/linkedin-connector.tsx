"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useCustomSession } from "@/hooks/use-custom-session"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Linkedin, Loader2, AlertCircle, CheckCircle2, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateRandomString } from "@/lib/utils"

interface LinkedInConnectorProps {
  onPostsImported: (posts: any[], profileId?: string) => void
}

export function LinkedInConnector({ onPostsImported }: LinkedInConnectorProps) {
  const { data: session, status } = useCustomSession()
  const { toast } = useToast()
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  const handleImportPosts = async () => {
    if (!session) {
      // Generate a state parameter for CSRF protection
      const state = generateRandomString(20)

      // Store the state in sessionStorage for verification later
      if (typeof window !== "undefined") {
        sessionStorage.setItem("linkedin_auth_state", state)
      }

      // Use NextAuth's signIn function with state parameter
      signIn("linkedin", {
        callbackUrl: window.location.href,
        state,
      })
      return
    }

    setIsImporting(true)
    setImportError(null)

    try {
      // Use HTTPS for all API calls
      const response = await fetch("/api/linkedin/posts", {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to import LinkedIn posts")
      }

      const data = await response.json()

      if (data.posts && data.posts.length > 0) {
        onPostsImported(data.posts, data.profileId)

        toast({
          title: data.profileCreated ? "Style Profile Created" : "Posts Imported",
          description: data.profileCreated
            ? `Created style profile from ${data.posts.length} LinkedIn posts`
            : `Imported ${data.posts.length} posts from LinkedIn`,
        })
      } else {
        setImportError("No posts found on your LinkedIn profile. Please create some posts on LinkedIn first.")
      }
    } catch (error) {
      console.error("Error importing LinkedIn posts:", error)
      setImportError(error instanceof Error ? error.message : "Failed to import LinkedIn posts")

      toast({
        title: "Import Failed",
        description: "Could not import posts from LinkedIn. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImporting(false)
    }
  }

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Linkedin className="h-5 w-5 text-[#0077B5]" />
          LinkedIn Integration
        </CardTitle>
        <CardDescription>Connect your LinkedIn account to analyze your posting history</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {importError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        {session ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle>Connected to LinkedIn</AlertTitle>
            <AlertDescription>
              Your LinkedIn account is connected. You can now import your posts for analysis.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Not Connected</AlertTitle>
            <AlertDescription>
              Connect your LinkedIn account to automatically analyze your posting history.
            </AlertDescription>
          </Alert>
        )}

        {/* Security information */}
        <Alert className="bg-blue-50 border-blue-200">
          <Shield className="h-4 w-4 text-blue-500" />
          <AlertTitle>Security Information</AlertTitle>
          <AlertDescription className="text-xs">
            We only request the minimal permissions needed to analyze your posts. Your credentials are never stored, and
            we use secure OAuth 2.0 authentication. All data is transmitted over HTTPS.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleImportPosts}
          disabled={isImporting}
          className={`w-full ${session ? "" : "bg-[#0077B5] hover:bg-[#0077B5]/90"}`}
        >
          {isImporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing Posts...
            </>
          ) : session ? (
            "Import LinkedIn Posts"
          ) : (
            <>
              <Linkedin className="mr-2 h-4 w-4" />
              Connect LinkedIn Account
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
