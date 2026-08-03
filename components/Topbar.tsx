"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, LogOut, Search } from "lucide-react"
import DarkModeToggle from "./DarkModeToggle"

type Me = {
  name: string
  email: string
}

export default function Topbar() {
  const router = useRouter()
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data))
      .catch(() => setMe(null))
  }, [])

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const initial = me?.name?.charAt(0)?.toUpperCase() || "T"

  return (
    <header className="bg-white/80 backdrop-blur border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="hidden md:flex items-center gap-3 bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2 w-80">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search students..."
          className="bg-transparent outline-none text-sm w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <DarkModeToggle />

        <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              {me?.name || "Teacher"}
            </p>
            <p className="text-xs text-slate-500">{me?.email || ""}</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold shadow-lg shadow-indigo-500/30">
            {initial}
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Logout"
          className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-sm font-medium transition-colors"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
