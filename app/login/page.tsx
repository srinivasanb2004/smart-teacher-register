"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { BookOpen, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [lastEmail, setLastEmail] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem("lastLoginEmail")
    if (stored) setLastEmail(stored)
  }, [])

  function continueAsLastAccount() {
    if (!lastEmail) return
    setEmail(lastEmail)
    setError("")
    passwordRef.current?.focus()
  }

  function useDifferentAccount() {
    setLastEmail(null)
    setEmail("")
    setPassword("")
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Invalid email or password")
        setLoading(false)
        return
      }

      localStorage.setItem("lastLoginEmail", email)

      router.push("/dashboard")
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <main className="ledger-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-4">
        {lastEmail && (
          <div className="paper-card rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--teal)] text-white font-semibold">
                {lastEmail.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--stone)]">Continue as</p>
                <p className="text-sm font-medium text-[var(--ink)] truncate">
                  {lastEmail}
                </p>
              </div>
            </div>

            <button
              onClick={continueAsLastAccount}
              className="shrink-0 rounded-xl px-4 py-2 text-sm font-medium teal-btn transition"
            >
              Login
            </button>
          </div>
        )}

        <div className="paper-card rounded-[28px] p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--teal)] text-white">
              <BookOpen className="h-8 w-8 text-amber-300" />
            </div>

            <h1 className="display-font mt-5 text-4xl font-semibold text-[var(--ink)]">
              {lastEmail ? "Use another account" : "Welcome Back"}
            </h1>

            <p className="mt-2 text-sm text-[var(--stone)]">
              {lastEmail
                ? "Sign in with a different teacher account below."
                : "Sign in to access your teacher register."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-[var(--paper-dark)] bg-white px-3 py-3 focus-within:border-[var(--teal)]">
                <Mail className="mr-3 h-5 w-5 text-[var(--stone)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="teacher@example.com"
                  className="w-full bg-transparent outline-none placeholder:text-[var(--stone)]/70"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-[var(--paper-dark)] bg-white px-3 py-3 focus-within:border-[var(--teal)]">
                <Lock className="mr-3 h-5 w-5 text-[var(--stone)]" />
                <input
                  ref={passwordRef}
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none placeholder:text-[var(--stone)]/70"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl px-4 py-3 font-medium teal-btn transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {lastEmail && (
            <button
              onClick={useDifferentAccount}
              className="mt-4 w-full text-center text-sm text-[var(--stone)] hover:text-[var(--teal)]"
            >
              Clear and start over
            </button>
          )}

          <p className="mt-6 text-center text-sm text-[var(--stone)]">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[var(--teal)] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}