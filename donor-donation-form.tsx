"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Gift, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapSelector } from "@/components/map-selector"
import { getUser } from "@/lib/auth"

export function DonorDonationForm() {
  const user = getUser()
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  async function handleCreate() {
    if (!title.trim() || !desc.trim()) {
      toast.error("Please fill in the title and description")
      return
    }

    if (!selectedLocation) {
      toast.error("Please select a location on the map")
      return
    }

    setLoading(true)
    setAiSuggestion("")
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          desc,
          donor: user?.name || "Anonymous",
          location: selectedLocation,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Unknown error" }))
        toast.error(error.error || "Failed to create donation")
        setLoading(false)
        return
      }

      const donation = await res.json()
      if (donation.aiSuggestion) {
        setAiSuggestion(donation.aiSuggestion)
      }
      toast.success(`Donation "${donation.title}" created successfully!`)
      setTitle("")
      setDesc("")
      setSelectedLocation(null)
    } catch (error) {
      console.error("Donation creation error:", error)
      toast.error("Failed to create donation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">
          Create Donation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          List a new donation to help those in need
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5 rounded-xl border border-border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="donation-title" className="text-sm text-foreground">
              Item Title
            </Label>
            <Input
              id="donation-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Winter Clothing Bundle"
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="donation-desc" className="text-sm text-foreground">
              Description
            </Label>
            <Textarea
              id="donation-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the donation item, quantity, condition..."
              rows={4}
              className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading || !selectedLocation}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Gift className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Donation"}
          </Button>

          {aiSuggestion && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" />
                <h3 className="text-sm font-semibold text-emerald-400">
                  AI Suggestion
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                {aiSuggestion}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-foreground">
            Select Location on Map
          </Label>
          <MapSelector
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
          {selectedLocation && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedLocation.lat.toFixed(4)},{" "}
              {selectedLocation.lng.toFixed(4)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
