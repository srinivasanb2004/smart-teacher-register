"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"

export default function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pendingFees, setPendingFees] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPendingFees(data?.pendingFees ?? 0))
      .catch(() => setPendingFees(0))
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const hasAlerts = (pendingFees ?? 0) > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl hover:bg-stone-100 transition-colors"
      >
        <Bell size={20} className="text-stone-600" />
        {hasAlerts && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-lg z-30">
          <div className="p-4 border-b border-stone-100">
            <p className="font-semibold text-stone-800 text-sm">
              Notifications
            </p>
          </div>

          <div className="p-4">
            {pendingFees === null ? (
              <p className="text-sm text-stone-500">Loading...</p>
            ) : hasAlerts ? (
              <button
                onClick={() => {
                  setOpen(false)
                  router.push("/dashboard/fees")
                }}
                className="w-full text-left text-sm text-stone-700 hover:text-teal-700"
              >
                <span className="font-medium">{pendingFees}</span> fee
                payment{pendingFees === 1 ? "" : "s"} pending. Tap to review.
              </button>
            ) : (
              <p className="text-sm text-stone-500">No new notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
