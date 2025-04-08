"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

export function useCustomSession() {
  const session = useSession()
  const [hasTimedOut, setHasTimedOut] = useState(false)

  // Add timeout detection for session loading
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null

    if (session.status === "loading") {
      timeoutId = setTimeout(() => {
        console.warn("Session loading timed out after 5 seconds")
        setHasTimedOut(true)
      }, 5000)
    } else {
      setHasTimedOut(false)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [session.status])

  // If we've timed out, return unauthenticated status
  if (hasTimedOut) {
    return {
      data: null,
      status: "unauthenticated",
      update: session.update,
    }
  }

  return session
}
