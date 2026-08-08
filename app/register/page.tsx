"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()

  const [name, setName] = useState("")
  const [schoolName, setSchoolName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, schoolName, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-amber-100 p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-white/90 backdrop-blur rounded-3xl shadow-xl p-8 space-y-5 border border-white/50"
      >
        <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
          S
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-800">
            Create Your Account
          </h1>
          <p className="text-stone-500 mt-2">
            Set up your own Smart Teacher Register workspace
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            School Name (optional)
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g. Green Valley High School"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="w-full border border-stone-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link href="/login" className="text-teal-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}