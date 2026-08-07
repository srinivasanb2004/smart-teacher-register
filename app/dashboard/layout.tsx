"use client";

import { GraduationCap } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  School,
  Layers,
  CalendarDays,
  ClipboardList,
  IndianRupee,
  FileBarChart,
  Settings,
  BookOpen,
  Bell,
  Menu,
} from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/academic-years", label: "Academic Years", icon: GraduationCap },
  { href: "/dashboard/classes", label: "Classes", icon: School },
  { href: "/dashboard/sections", label: "Sections", icon: Layers },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/attendance", label: "Attendance", icon: CalendarDays },
  { href: "/dashboard/marks", label: "Marks", icon: ClipboardList },
  { href: "/dashboard/fees", label: "Fees", icon: IndianRupee },
  { href: "/dashboard/reports", label: "Reports", icon: FileBarChart },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const [teacherName, setTeacherName] = useState("Teacher");
  const [schoolName, setSchoolName] = useState("Smart Teacher Register");
  const [teacherEmail, setTeacherEmail] = useState("teacher@example.com");

  useEffect(() => {
    const saved = localStorage.getItem("schoolSettings");

    if (saved) {
      const settings = JSON.parse(saved);

      setTeacherName(settings.teacherName || "Teacher");
      setSchoolName(settings.schoolName || "Smart Teacher Register");
      setTeacherEmail(settings.teacherEmail || "teacher@example.com");
    }
  }, []);

  return (
    <div className="ledger-bg min-h-screen">
      <div className="flex min-h-screen">
        {open && (
          <button
            aria-label="Close sidebar"
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 teal-gradient p-6 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="flex items-center gap-3 border-b border-white/10 pb-6">
            <div className="rounded-xl border border-amber-300/40 bg-white/5 p-2">
              <BookOpen className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <p className="display-font text-xl font-semibold leading-none">
                SMART
              </p>
              <p className="display-font text-xl font-semibold leading-none">
                TEACHER REGISTER
              </p>
              <p className="mt-1 text-xs text-white/60">
                Digital Classroom Register
              </p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${active
                    ? "bg-white/15 text-white shadow-lg"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-white/60">Academic Year</p>
              <p className="mt-1 font-semibold text-white">2026 – 2027</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 w-3/4 rounded-full bg-amber-300" />
              </div>
              <p className="mt-2 text-xs text-white/60">
                75% term completed
              </p>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[var(--paper-dark)] bg-[#f9f3e6]/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-[var(--paper-dark)] bg-white p-2 text-[var(--ink)] lg:hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div>
                  <h1 className="display-font text-2xl font-semibold text-[var(--ink)]">
                    {schoolName}
                  </h1>
                  <p className="text-sm text-[var(--stone)]">
                    Teacher Dashboard
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="relative rounded-xl border border-[var(--paper-dark)] bg-white p-2 text-[var(--ink)] hover:bg-[var(--paper)]">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--amber)] ring-2 ring-[#f9f3e6]" />
                </button>

                <div className="flex items-center gap-3 rounded-2xl border border-[var(--paper-dark)] bg-white px-3 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--teal)] text-sm font-semibold text-white">
                    {teacherName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      {teacherName}
                    </p>
                    <p className="text-xs text-[var(--stone)] truncate max-w-[160px]">
                      {teacherEmail}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}