"use client"

import { useState, useEffect } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function DebugFullPage() {
  const { data: session, status } = useSession()
  const [apiSession, setApiSession] = useState<any>(null)
  const [apiSessionError, setApiSessionError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>(null)
  const [envVarsError, setEnvVarsError] = useState<string | null>(null)
  const [cookies, setCookies] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [providers, setProviders] = useState<any>(null)
  const [providersError, setProvidersError] = useState<string | null>(null)

  // Fetch session data from API
  const fetchSessionData = async () => {
    try {
      setApiSessionError(null)
      const res = await fetch("/api/auth/session")
      if (!res.ok) throw new Error(`Failed to fetch session: ${res.status}`)
      const data = await res.json()
      setApiSession(data)
    } catch (err) {
      console.error("Error fetching session data:", err)
      setApiSessionError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  // Fetch environment variables
  const fetchEnvVars = async () => {
    try {
      setEnvVarsError(null)
      const res = await fetch("/api/auth/check-env")
      if (!res.ok) throw new Error(`Failed to fetch environment variables: ${res.status}`)
      const data = await res.json()
      setEnvVars(data)
    } catch (err) {
      console.error("Error fetching environment variables:", err)
      setEnvVarsError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  // Get cookies (client-side only)
  const getCookies = () => {
    setCookies(document.cookie)
  }

  // Add this function to fetch providers safely
  const fetchProviders = async () => {
    try {
      setProvidersError(null)
      const res = await fetch("/api/auth/providers")

      if (!res.ok) {
        throw new Error(`Failed to fetch providers: ${res.status}`)
      }

      const data = await res.json()
      setProviders(data)
    } catch (err) {
      console.error("Error fetching providers:", err)
      setProvidersError(err instanceof Error ? err.message : "Unknown error")
    }
  }

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true)
      await Promise.all([fetchSessionData(), fetchEnvVars(), fetchProviders()])
      getCookies()
      setIsLoading(false)
    }

    fetchAllData()
  }, [])

  // Refresh all data
  const refreshAllData = async () => {
    setIsLoading(true)
    await Promise.all([fetchSessionData(), fetchEnvVars(), fetchProviders()])
    getCookies()
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Authentication Debug</h1>
      <p className="text-muted-foreground mb-6">Comprehensive debugging for NextAuth.js authentication</p>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              status === "authenticated" ? "bg-green-500" : status === "loading" ? "bg-yellow-500" : "bg-red-500"
            }`}
          ></div>
          <span className="font-medium">
            Status:{" "}
            {status === "loading" ? "Loading..." : status === "authenticated" ? "Authenticated" : "Unauthenticated"}
          </span>
        </div>
        <Button onClick={refreshAllData} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh All
        </Button>
      </div>

      <Tabs defaultValue="session">
        <TabsList className="mb-4">
          <TabsTrigger value="session">Session</TabsTrigger>
          <TabsTrigger value="environment">Environment</TabsTrigger>
          <TabsTrigger value="cookies">Cookies</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="session">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>React Hook Session</CardTitle>
                <CardDescription>Session data from useSession() hook</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                  {JSON.stringify(session, null, 2) || "No session data"}
                </pre>
              </CardContent>
              <CardFooter>
                <div className="text-sm text-muted-foreground">
                  {session ? "Session is available" : "No session found"}
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Session</CardTitle>
                <CardDescription>Session data from /api/auth/session endpoint</CardDescription>
              </CardHeader>
              <CardContent>
                {apiSessionError ? (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{apiSessionError}</AlertDescription>
                  </Alert>
                ) : null}
                <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                  {JSON.stringify(apiSession, null, 2) || "No API session data"}
                </pre>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" onClick={fetchSessionData}>
                  Refresh API Session
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environment">
          <Card>
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>Configuration for NextAuth.js</CardDescription>
            </CardHeader>
            <CardContent>
              {envVarsError ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{envVarsError}</AlertDescription>
                </Alert>
              ) : null}
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                {JSON.stringify(envVars, null, 2) || "No environment data"}
              </pre>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={fetchEnvVars}>
                Refresh Environment Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="cookies">
          <Card>
            <CardHeader>
              <CardTitle>Browser Cookies</CardTitle>
              <CardDescription>Cookies that might affect authentication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Raw Cookie String:</h3>
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[100px] text-xs">
                    {cookies || "No cookies found"}
                  </pre>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Parsed Cookies:</h3>
                  <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[200px]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr>
                          <th className="text-left font-medium p-2 border-b">Name</th>
                          <th className="text-left font-medium p-2 border-b">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cookies.split(";").map((cookie, index) => {
                          const [name, value] = cookie.trim().split("=")
                          return (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="p-2 font-medium">{name}</td>
                              <td className="p-2 break-all">
                                {name.includes("next-auth.session-token") ? "[Session Token]" : value}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={getCookies}>
                Refresh Cookies
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Actions</CardTitle>
              <CardDescription>Test authentication functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Sign In / Sign Out</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => signIn("linkedin", { callbackUrl: "/auth/debug-full" })}
                      disabled={status === "authenticated"}
                    >
                      Sign In with LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => signOut({ callbackUrl: "/auth/debug-full" })}
                      disabled={status !== "authenticated"}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-medium">Test API Endpoints</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="/api/auth/session" target="_blank" rel="noopener noreferrer">
                        Test /api/auth/session
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/api/auth/csrf" target="_blank" rel="noopener noreferrer">
                        Test /api/auth/csrf
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/auth/providers")
                          const data = await res.json()
                          alert(JSON.stringify(data, null, 2))
                        } catch (error) {
                          alert(`Error fetching providers: ${error instanceof Error ? error.message : "Unknown error"}`)
                        }
                      }}
                    >
                      Test /api/auth/providers
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/api/auth/check-env" target="_blank" rel="noopener noreferrer">
                        Test /api/auth/check-env
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Providers</CardTitle>
              <CardDescription>Available authentication providers</CardDescription>
            </CardHeader>
            <CardContent>
              {providersError ? (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{providersError}</AlertDescription>
                </Alert>
              ) : null}
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[300px] text-xs">
                {JSON.stringify(providers, null, 2) || "No providers data"}
              </pre>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" onClick={fetchProviders}>
                Refresh Providers
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Check Environment Variables</p>
              <p className="text-sm text-muted-foreground">
                Ensure NEXTAUTH_URL, NEXTAUTH_SECRET, LINKEDIN_CLIENT_ID, and LINKEDIN_CLIENT_SECRET are set correctly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Verify Callback URLs</p>
              <p className="text-sm text-muted-foreground">
                Make sure your LinkedIn OAuth app has the correct callback URL configured.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Clear Browser Cookies</p>
              <p className="text-sm text-muted-foreground">
                Try clearing your browser cookies and cache, then sign in again.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Check Network Requests</p>
              <p className="text-sm text-muted-foreground">
                Use browser developer tools to check for any failed network requests or error responses.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
