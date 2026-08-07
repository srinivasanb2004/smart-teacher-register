"use client"

import { useEffect, useState } from "react"

type Settings = {
  teacherName: string
  schoolName: string
}

export default function WelcomeHeader() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [today, setToday] = useState("")

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/settings", { cache: "no-store" })
      const data = await res.json()
      setSettings(data)
    }

    load()

    // Set date only on client to avoid hydration mismatch
    setToday(new Date().toLocaleDateString("en-IN"))
  }, [])

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">
          Welcome, {settings?.teacherName || "Teacher"} 👋
        </h1>

        <p className="text-stone-500 mt-2">
          {settings?.schoolName || "Smart Teacher Register"}
        </p>
      </div>

      <div className="text-sm text-stone-500 bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm">
        Today • {today || "Loading..."}
      </div>
    </div>
  )
}