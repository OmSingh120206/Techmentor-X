"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MobileHeader } from "@/components/mobile-header"
import { StatsDashboard } from "@/components/stats-dashboard"
import { NGODonationList } from "@/components/ngo-donation-list"
import { getUser } from "@/lib/auth"

export function NGODashboard() {
  const [activeSection, setActiveSection] = useState("donations")
  const user = getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AppSidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          role="ngo"
          userName={user?.name}
        />
      </div>

      {/* Mobile header */}
      <MobileHeader
        activeSection={activeSection}
        onNavigate={setActiveSection}
        role="ngo"
      />

      {/* Main content */}
      <main className="pt-14 lg:ml-64 lg:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8 lg:py-10">
          {/* Page header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                NGO Dashboard
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-muted-foreground">
                System Active
              </span>
            </div>
          </div>

          {/* Active section */}
          {activeSection === "dashboard" && <StatsDashboard />}
          {activeSection === "donations" && <NGODonationList />}
        </div>
      </main>
    </div>
  )
}
