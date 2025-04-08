"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { signIn, signOut } from "next-auth/react"

export function AuthStatus() {
  const { data: session, status } = useSession()

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-md">
      <div className="text-center">
        <div className="font-medium">Authentication Status</div>
        <div className="text-sm text-muted-foreground">
          {status === "loading" ? "Loading..." : status === "authenticated" ? "Authenticated" : "Not authenticated"}
        </div>
      </div>

      {session ? (
        <div className="text-center">
          <div>Signed in as {session.user?.name || "Unknown User"}</div>
          <Button variant="outline" size="sm" onClick={() => signOut()} className="mt-2">
            Sign out
          </Button>
        </div>
      ) : (
        <Button size="sm" onClick={() => signIn("linkedin")}>
          Sign in with LinkedIn
        </Button>
      )}
    </div>
  )
}
