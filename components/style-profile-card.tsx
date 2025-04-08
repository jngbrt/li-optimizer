"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { StyleProfile } from "@/lib/types"
import { Check, Trash2 } from "lucide-react"

interface StyleProfileCardProps {
  profile: StyleProfile
  isActive: boolean
  onSelect: () => void
  onDelete: (id: string) => void
}

export function StyleProfileCard({ profile, isActive, onSelect, onDelete }: StyleProfileCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className={`relative ${isActive ? "border-primary" : ""}`}>
      {isActive && (
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
          <Check className="h-4 w-4" />
        </div>
      )}

      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{profile.name}</span>
          <div className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs">
            {profile.sampleCount} samples
          </div>
        </CardTitle>
        <CardDescription>{profile.description || "Writing style profile"}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="text-sm">{formatDate(profile.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Updated</p>
            <p className="text-sm">{formatDate(profile.updatedAt)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          {profile.styleInsights.topicAreas.slice(0, 3).map((topic, index) => (
            <div key={index} className="border border-input px-2 py-0.5 rounded-md text-xs">
              {topic}
            </div>
          ))}
          {profile.styleInsights.topicAreas.length > 3 && (
            <div className="border border-input px-2 py-0.5 rounded-md text-xs">
              +{profile.styleInsights.topicAreas.length - 3} more
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(profile.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>

        <Button variant={isActive ? "secondary" : "default"} size="sm" onClick={onSelect}>
          {isActive ? "Selected" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  )
}
