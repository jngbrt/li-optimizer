"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { PenTool, BarChart3, Home, Shield } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-lg">
            ThoughtLeader
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              href="/writing-assistant"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/writing-assistant" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Writing Assistant
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/analytics" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/security"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/security" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Security
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="md:hidden flex">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/writing-assistant">
              <Button variant="ghost" size="icon">
                <PenTool className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/analytics">
              <Button variant="ghost" size="icon">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/security">
              <Button variant="ghost" size="icon">
                <Shield className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          <Button variant="default" className="hidden md:flex">
            Create New Post
          </Button>
        </div>
      </div>
    </header>
  )
}
