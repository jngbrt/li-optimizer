"use client"

import { useState, useEffect } from "react"
import type { StyleProfile } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { formatDate } from "@/lib/db-utils"
import { ProfileDetail } from "@/components/profile-detail"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ProfileList() {
  const [profiles, setProfiles] = useState<StyleProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<StyleProfile | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/profiles")
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles || [])
      } else {
        console.error("Error response from profiles API:", await response.text())
        setProfiles([])
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      setProfiles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewProfile = async (profileId: string) => {
    setIsLoadingProfile(true)
    setProfileError(null)

    try {
      const response = await fetch(`/api/profiles/${profileId}`)

      if (response.ok) {
        const data = await response.json()
        setSelectedProfile(data.profile)
        setIsDetailDialogOpen(true)
      } else {
        const errorData = await response.json().catch(() => ({ error: "Failed to fetch profile" }))
        setProfileError(errorData.error || "Failed to fetch profile")
        console.error("Error response from profile detail API:", errorData)
      }
    } catch (error) {
      console.error("Error fetching profile details:", error)
      setProfileError("Failed to fetch profile details. Please try again.")
    } finally {
      setIsLoadingProfile(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={fetchProfiles}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-4"></div>
          <p>Loading profiles...</p>
        </div>
      ) : profiles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewProfile(profile.id)}
            >
              <CardHeader>
                <CardTitle>{profile.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{profile.description || "No description"}</p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Samples: {profile.sampleCount}</span>
                  <span>Created: {formatDate(profile.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <h3 className="text-lg font-medium mb-2">No profiles found</h3>
          <p className="text-muted-foreground">No style profiles have been created yet.</p>
        </div>
      )}

      {/* Profile Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Style Profile Details</DialogTitle>
          </DialogHeader>

          {isLoadingProfile ? (
            <div className="py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mb-4"></div>
              <p>Loading profile details...</p>
            </div>
          ) : profileError ? (
            <Alert variant="destructive">
              <AlertDescription>{profileError}</AlertDescription>
            </Alert>
          ) : selectedProfile ? (
            <ProfileDetail profile={selectedProfile} />
          ) : (
            <p className="text-center text-muted-foreground py-4">No profile details available</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
