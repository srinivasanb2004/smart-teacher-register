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
    if (me?.email) {
      localStorage.setItem("lastLoginEmail", me.email)
    }
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  const initial = me?.name?.charAt(0)?.toUpperCase() || "T"

  return (
    <header className="w-full space-y-3">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-[#e8dfc8] bg-[#f8f3e7]/95 px-3 py-3 shadow-sm backdrop-blur md:px-4 lg:px-5">
        {/* Left: compact title */}
        <div className="min-w-0 pl-14 lg:pl-0">
          <h1 className="truncate text-base font-semibold text-[#18322d] md:text-lg lg:text-xl">
            Smart Teacher Register
          </h1>
          <p className="text-xs text-stone-600 md:text-sm">
            Teacher Dashboard
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8dfc8] bg-white shadow-sm md:h-11 md:w-11">
            <NotificationBell />
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#e8dfc8] bg-white px-2 py-2 shadow-sm md:px-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[140px] truncate text-sm font-semibold text-stone-800">
                {me?.name || "Teacher"}
              </p>
              <p className="max-w-[140px] truncate text-xs text-stone-500">
                {me?.email || ""}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-sm font-semibold text-white shadow-lg shadow-teal-500/20">
              {initial}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e8dfc8] bg-white text-stone-600 shadow-sm transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:h-11 md:w-11"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="w-full">
        <StudentSearch />
      </div>
    </header>
  )
}