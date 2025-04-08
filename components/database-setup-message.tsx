"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Database } from "lucide-react"

interface DatabaseSetupMessageProps {
  onSetupClick: () => void
}

export function DatabaseSetupMessage({ onSetupClick }: DatabaseSetupMessageProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <CardTitle>Database Setup Required</CardTitle>
        </div>
        <CardDescription>
          Your database tables need to be initialized before you can use this application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <p className="text-sm text-amber-800">
            It looks like the database tables for this application haven't been created yet. This is normal if this is
            your first time running the application.
          </p>
        </div>
        <div className="flex items-center gap-3 p-4 border rounded-md">
          <Database className="h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Database Initialization</h3>
            <p className="text-sm text-muted-foreground">
              You need to run the SQL setup script to create the necessary tables for storing your LinkedIn posts and
              style profiles.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSetupClick} className="w-full">
          Go to Database Setup
        </Button>
      </CardFooter>
    </Card>
  )
}
