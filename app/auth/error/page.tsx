"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An unexpected error occurred during authentication."
  let errorDescription = "Please try again or contact support if the problem persists."
  let errorDetails = ""

  if (error === "Configuration") {
    errorMessage = "Server configuration error"
    errorDescription = "There is a problem with the server configuration. Please contact support."
  } else if (error === "AccessDenied") {
    errorMessage = "Access denied"
    errorDescription = "You do not have permission to sign in."
  } else if (error === "Verification") {
    errorMessage = "Verification error"
    errorDescription = "The verification link may have been used or is no longer valid."
  } else if (error === "OAuthSignin" || error === "OAuthCallback" || error === "OAuthCreateAccount") {
    errorMessage = "LinkedIn authentication error"
    errorDescription = "There was a problem with the LinkedIn authentication process. Please try again."
  } else if (error === "OAuthAccountNotLinked") {
    errorMessage = "Account not linked"
    errorDescription = "This email is already associated with another account."
  } else if (error === "EmailSignin") {
    errorMessage = "Email sign in error"
    errorDescription = "The email could not be sent or has expired."
  } else if (error === "CredentialsSignin") {
    errorMessage = "Invalid credentials"
    errorDescription = "The credentials you provided are invalid."
  } else if (error === "SessionRequired") {
    errorMessage = "Session required"
    errorDescription = "You must be signed in to access this page."
  } else if (error === "Default") {
    errorMessage = "Authentication error"
    errorDescription = "An unexpected error occurred during authentication."
  } else if (error?.includes("CLIENT_FETCH_ERROR")) {
    errorMessage = "Connection error"
    errorDescription = "There was a problem connecting to the authentication service. Please try again."
    errorDetails = "This may be due to network issues or server configuration problems."
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-red-600">{errorMessage}</CardTitle>
          <CardDescription>{errorDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-sm text-red-700 mb-4">
            <p>Error code: {error || "Unknown"}</p>
            {errorDetails && <p className="mt-2">{errorDetails}</p>}
          </div>

          <div className="mt-4 text-sm">
            <p className="font-medium">Troubleshooting steps:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Check your internet connection</li>
              <li>Clear your browser cookies and cache</li>
              <li>Try using a different browser</li>
              <li>Ensure you're using the correct LinkedIn credentials</li>
              <li>Try again in a few minutes</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/">Go to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
