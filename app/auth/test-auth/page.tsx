"use client"

import { useEffect, useState } from "react"
import { useCustomSession } from "@/hooks/use-custom-session"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"

export default function TestAuthPage() {
  const { data: session, status } = useCustomSession()
  const [apiSession, setApiSession] = useState<any>(null)

  const fetchSessionFromApi = async () => {
    try {
      const res = await fetch("/api/auth/session")
      const data = await res.json()
      setApiSession(data)
    } catch (error) {
      console.error("Error fetching session from API:", error)
    }
  }

  useEffect(() => {
    fetchSessionFromApi()
  }, [])

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Session Status: {status}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="font-medium mb-2">React Hook Session:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(session, null, 2)}</pre>
            </div>

            <div className="mb-4">
              <h3 className="font-medium mb-2">API Session:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(apiSession, null, 2)}</pre>
              <Button onClick={fetchSessionFromApi} className="mt-2">
                Refresh API Session
              </Button>
            </div>

            <div className="flex gap-4 mt-6">
              {!session ? (
                <Button onClick={() => signIn("linkedin")}>Sign in with LinkedIn</Button>
              ) : (
                <Button onClick={() => signOut()}>Sign out</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
