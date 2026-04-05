"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { UserPlus, User, Building2, Heart, LogIn, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { setUser, getUser, type UserRole } from "@/lib/auth"

const allRoles = [
  {
    value: "donor" as const,
    label: "Donor",
    description: "Contribute items & resources",
    icon: Heart,
  },
  {
    value: "volunteer" as const,
    label: "Volunteer",
    description: "Help deliver donations",
    icon: User,
  },
  {
    value: "ngo" as const,
    label: "NGO",
    description: "Organize and distribute",
    icon: Building2,
  },
]

export function LoginForm() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<UserRole>("donor")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Redirect if already logged in
    const user = getUser()
    if (user) {
      router.push(`/${user.role}`)
    }
  }, [router])

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and password")
      return
    }

    // Validate email format - must contain @
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address (must contain @)")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/register", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.error || "Login failed")
        setLoading(false)
        return
      }

      const user = await res.json()

      // Verify role matches
      if (user.role !== role) {
        toast.error(`This account is registered as ${user.role}, not ${role}. Please select the correct role.`)
        setLoading(false)
        return
      }

      // Store user in localStorage
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points,
      })

      toast.success(`Welcome back, ${user.name}!`)
      router.push(`/${user.role}`)
    } catch {
      toast.error("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    // Validate inputs
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    // Validate email format - must contain @
    if (!email.includes("@")) {
      toast.error("Please enter a valid email address (must contain @)")
      return
    }

    if (!role) {
      toast.error("Please select a role")
      return
    }

    // Prepare registration payload
    const registrationData = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      role: role,
    }

    // Debug: Log registration attempt
    console.log("Registration attempt:", {
      name: registrationData.name,
      email: registrationData.email,
      role: registrationData.role,
      hasPassword: !!registrationData.password,
    })

    setLoading(true)
    try {
      console.log("Sending registration request to /api/register")
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      })

      console.log("Registration response status:", res.status, res.statusText)

      const responseData = await res.json()
      console.log("Registration response data:", responseData)

      if (!res.ok) {
        const errorMessage = responseData.error || `Registration failed (${res.status})`
        console.error("Registration failed:", errorMessage)
        toast.error(errorMessage)
        setLoading(false)
        return
      }

      // Validate response
      if (!responseData || !responseData.id) {
        console.error("Invalid response from server:", responseData)
        toast.error("Invalid response from server. Please try again.")
        setLoading(false)
        return
      }

      const user = responseData

      // Store user in localStorage
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        points: user.points || 0,
      })

      console.log("User registered and stored:", user)

      toast.success(`Welcome, ${user.name}! Registered as ${user.role}.`)

      // Redirect based on role
      const redirectPath = `/${user.role}`
      console.log("Redirecting to:", redirectPath)
      router.push(redirectPath)
    } catch (error) {
      console.error("Registration error:", error)
      const errorMessage = error instanceof Error ? error.message : "Network error. Please check your connection."
      toast.error(`Registration failed: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Show all roles for both login and registration
  const rolesToShow = allRoles

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Social mentor - smart community donation and service platform</h1>
           
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? "Sign in to access your dashboard" : "Create a new account"}
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-border bg-card p-6">
          {/* Role Selection - Always shown */}
          <div className="space-y-3">
            <Label className="text-sm text-foreground">
              {isLogin ? "Select Your Role" : "Select Your Role"}
            </Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {rolesToShow.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all",
                    role === r.value
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground"
                  )}
                >
                  <r.icon
                    className={cn(
                      "h-6 w-6",
                      role === r.value
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="text-sm font-medium">{r.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="register-name" className="text-sm text-foreground">
                Full Name
              </Label>
              <Input
                id="register-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm text-foreground">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (must contain @)"
                className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
                required
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    isLogin ? handleLogin() : handleRegister()
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm text-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter your password" : "Enter password (min 6 characters)"}
                className="border-border bg-secondary pl-10 text-foreground placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    isLogin ? handleLogin() : handleRegister()
                  }
                }}
              />
            </div>
          </div>

          <Button
            onClick={isLogin ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLogin ? (
              <LogIn className="mr-2 h-4 w-4" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            {loading
              ? isLogin
                ? "Signing in..."
                : "Registering..."
              : isLogin
                ? "Sign In"
                : "Register"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setName("")
                setEmail("")
                setPassword("")
                setRole("donor") // Reset to donor when switching
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
