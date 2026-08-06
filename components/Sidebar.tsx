"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarRange,
  BookOpen,
  IndianRupee,
  Users,
  School,
  Layers,
  FileBarChart,
  Settings,
  Menu,
  X,
} from "lucide-react"

const menu = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Academic Years", href: "/dashboard/academic-years", icon: CalendarRange },
  { name: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { name: "Marks", href: "/dashboard/marks", icon: BookOpen },
  { name: "Fees", href: "/dashboard/fees", icon: IndianRupee },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Classes", href: "/dashboard/classes", icon: School },
  { name: "Sections", href: "/dashboard/sections", icon: Layers },
  { name: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

function SidebarContent({
  pathname,
  close,
}: {
  pathname: string
  close?: () => void
}) {
  return (
    <div className="w-72 bg-slate-950 text-white min-h-screen flex flex-col border-r border-slate-900">
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/30">
            S
          </div>

          <div>
            <h1 className="font-bold text-lg tracking-tight">Smart Teacher</h1>
            <p className="text-slate-400 text-sm">School ERP</p>
          </div>
        </div>

        {close && (
          <button onClick={close} className="lg:hidden p-2 rounded-lg hover:bg-slate-900">
            <X size={22} />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        {menu.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={close}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon size={20} className="transition-transform group-hover:scale-110" />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <div className="rounded-2xl bg-slate-900 p-4">
          <p className="text-sm font-semibold">Smart Teacher Register</p>
          <p className="text-xs text-slate-400 mt-1">Version 1.0 • 2026</p>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Prevent the page behind the drawer from scrolling while it's open,
  // so touch/scroll gestures go to the drawer instead of the page.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-slate-950 text-white p-3 rounded-xl shadow-lg"
      >
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <SidebarContent pathname={pathname} />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden overflow-y-auto overscroll-contain"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 min-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent pathname={pathname} close={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}