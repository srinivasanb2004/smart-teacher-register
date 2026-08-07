"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import StudentSearch from "./StudentSearch"
import NotificationBell from "./NotificationBell"

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
    <header className="bg-white/80 backdrop-blur border-b border-stone-200 px-4 md:px-6 py-3 md:py-4 sticky top-0 z-20 space-y-3">
      <div className="flex items-center justify-between gap-3">
        {/* Reserves space so this row doesn't sit under the fixed mobile menu button */}
        <div className="w-10 lg:hidden shrink-0" />

        <div className="hidden lg:block flex-1 max-w-md">
          <StudentSearch />
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <NotificationBell />

          <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-2xl px-3 py-2 shadow-sm">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-stone-800">
                {me?.name || "Teacher"}
              </p>
              <p className="text-xs text-stone-500">{me?.email || ""}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold shadow-lg shadow-teal-500/30">
              {initial}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-stone-200 bg-white hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-stone-600 text-sm font-medium transition-colors"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <div className="lg:hidden">
        <StudentSearch />
      </div>
    </header>
  )
}
