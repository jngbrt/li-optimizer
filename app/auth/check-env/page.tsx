"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CheckEnvPage() {
  const [envVars, setEnvVars] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEnvVars = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/check-env")
      if (!res.ok) {
        throw new Error(`Failed to fetch environment variables: ${res.status}`)
      }
      const data = await res.json()
      setEnvVars(data)
    } catch (err) {
      console.error("Error fetching environment variables:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEnvVars()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Check</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>NextAuth Environment Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="font-semibold">NEXTAUTH_URL:</div>
                  <div>{envVars?.nextAuthUrl || "Not set"}</div>

                  <div className="font-semibold">NEXTAUTH_SECRET:</div>
                  <div>{envVars?.nextAuthSecret || "Not set"}</div>

                  <div className="font-semibold">LINKEDIN_CLIENT_ID:</div>
                  <div>{envVars?.linkedinClientId || "Not set"}</div>

                  <div className="font-semibold">LINKEDIN_CLIENT_SECRET:</div>
                  <div>{envVars?.linkedinClientSecret || "Not set"}</div>

                  <div className="font-semibold">NODE_ENV:</div>
                  <div>{envVars?.nodeEnv || "Not set"}</div>

                  <div className="font-semibold">VERCEL_URL:</div>
                  <div>{envVars?.vercelUrl || "Not set"}</div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-medium text-yellow-800 mb-2">Important Notes:</h3>
                  <ul className="list-disc pl-5 text-sm text-yellow-700 space-y-1">
                    <li>NEXTAUTH_URL should be the full URL of your site (e.g., https://your-domain.com)</li>
                    <li>NEXTAUTH_SECRET should be a random string (32+ characters)</li>
                    <li>For Vercel deployments, NEXTAUTH_URL is now automatically set based on VERCEL_URL</li>
                    <li>Make sure your LinkedIn OAuth app has the correct callback URLs configured</li>
                  </ul>
                </div>
              </div>

              <Button onClick={fetchEnvVars} className="mt-4">
                Refresh
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
