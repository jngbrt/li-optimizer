"use client"

import { useState, useEffect } from "react"
import { useCustomSession } from "@/hooks/use-custom-session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DebugPage() {
  const { data: session, status } = useCustomSession()
  const [sessionData, setSessionData] = useState<any>(null)
  const [config, setConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSessionData = async () => {
    try {
      const res = await fetch("/api/auth/session")
      if (!res.ok) throw new Error(`Failed to fetch session: ${res.status}`)
      const data = await res.json()
      setSessionData(data)
    } catch (err) {
      console.error("Error fetching session data:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  const fetchConfig = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/auth/check-config")
      if (!res.ok) throw new Error(`Failed to fetch config: ${res.status}`)
      const data = await res.json()
      setConfig(data)
    } catch (err) {
      console.error("Error fetching config:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSessionData()
    fetchConfig()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Status: {status}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
              {JSON.stringify(sessionData, null, 2) || JSON.stringify(session, null, 2)}
            </pre>
            <Button onClick={fetchSessionData} className="mt-4">
              Refresh Session
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NextAuth Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(config, null, 2)}</pre>
            )}
            <Button onClick={fetchConfig} className="mt-4">
              Refresh
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <a href="/api/auth/signin" className="text-blue-500 hover:underline">
                /api/auth/signin
              </a>
            </div>
            <div>
              <a href="/api/auth/signin/linkedin" className="text-blue-500 hover:underline">
                /api/auth/signin/linkedin
              </a>
            </div>
            <div>
              <a href="/api/auth/session" className="text-blue-500 hover:underline">
                /api/auth/session
              </a>
            </div>
            <div>
              <a href="/api/auth/check-config" className="text-blue-500 hover:underline">
                /api/auth/check-config
              </a>
            </div>
            <div>
              <a href="/api/auth/debug-linkedin" className="text-blue-500 hover:underline">
                /api/auth/debug-linkedin
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
