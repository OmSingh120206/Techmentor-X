"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Gift,
  ListChecks,
  Heart,
  LogOut,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { clearUser, type UserRole } from "@/lib/auth"

interface AppSidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
  role: UserRole
  userName?: string
}

const roleNavItems: Record<UserRole, Array<{ id: string; label: string; icon: any }>> = {
  donor: [
    { id: "create-donation", label: "New Donation", icon: Gift },
  ],
  volunteer: [
    { id: "donations", label: "Available Donations", icon: ListChecks },
    { id: "leaderboard", label: "Leaderboard", icon: LayoutDashboard },
  ],
  ngo: [
    { id: "donations", label: "Received Donations", icon: ListChecks },
    { id: "dashboard", label: "Impact Dashboard", icon: LayoutDashboard },
  ],
}

export function AppSidebar({ activeSection, onNavigate, role, userName }: AppSidebarProps) {
  const router = useRouter()
  const navItems = roleNavItems[role] || []

  function handleLogout() {
    clearUser()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            Social Mentor
          </h1>
          <p className="text-xs text-muted-foreground">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </p>
        </div>
      </div>

      {userName && (
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{userName}</span>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeSection === item.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}
