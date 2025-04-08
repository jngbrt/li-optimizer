"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Linkedin, ArrowRight, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSignIn = async () => {
    setIsLoading(true)
    // Use NextAuth's signIn function
    signIn("linkedin", { callbackUrl })
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect with LinkedIn</CardTitle>
          <CardDescription>Sign in with your LinkedIn account to analyze your writing style</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Error</AlertTitle>
              <AlertDescription>
                {error === "OAuthSignin" && "Error starting the LinkedIn sign in process."}
                {error === "OAuthCallback" && "Error during the LinkedIn callback process."}
                {error === "OAuthCreateAccount" && "Error creating a user account."}
                {error === "EmailCreateAccount" && "Error creating a user account."}
                {error === "Callback" && "Error during the callback process."}
                {error === "OAuthAccountNotLinked" && "The email is already associated with another account."}
                {error === "EmailSignin" && "Error sending the email for sign in."}
                {error === "CredentialsSignin" && "Invalid credentials."}
                {error === "SessionRequired" && "You must be signed in to access this page."}
                {error === "Default" && "An unexpected error occurred."}
                {![
                  "OAuthSignin",
                  "OAuthCallback",
                  "OAuthCreateAccount",
                  "EmailCreateAccount",
                  "Callback",
                  "OAuthAccountNotLinked",
                  "EmailSignin",
                  "CredentialsSignin",
                  "SessionRequired",
                  "Default",
                ].includes(error) && error}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-700">
            <p>
              Connecting your LinkedIn account allows us to analyze your posting history and create a personalized
              writing style profile. We only access your public posts and basic profile information.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Benefits of connecting:</h3>
            <ul className="text-sm space-y-1">
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span>Automatic analysis of your writing style</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span>No need to manually upload content samples</span>
              </li>
              <li className="flex items-start gap-2">
                <ArrowRight className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span>Generate content that matches your authentic voice</span>
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignIn} disabled={isLoading} className="w-full bg-[#0077B5] hover:bg-[#0077B5]/90">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Linkedin className="mr-2 h-4 w-4" />
                Sign in with LinkedIn
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
