"use client"

import { signIn } from "next-auth/react"
import { useCustomSession } from "@/hooks/use-custom-session"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const { status } = useCustomSession()

  const handleSignIn = () => {
    signIn("linkedin", { callbackUrl: "/dashboard" })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-6">LinkedIn Optimizer</h1>

        <p className="text-gray-600 mb-8 text-center">
          Analyze your LinkedIn writing style and generate personalized content
        </p>

        <div className="space-y-4">
          {status === "loading" ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </Button>
          ) : status === "authenticated" ? (
            <Link href="/dashboard" className="block w-full">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
          ) : (
            <Button onClick={handleSignIn} className="w-full">
              Sign In with LinkedIn
            </Button>
          )}

          <Link href="/auth/debug" className="block w-full">
            <Button variant="outline" className="w-full">
              Debug Authentication
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
