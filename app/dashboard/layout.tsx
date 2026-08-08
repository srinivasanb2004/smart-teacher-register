"use client";

import { GraduationCap } from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Menu,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import StudentSearch from "../../components/StudentSearch";
import NotificationBell from "../../components/NotificationBell";

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
  const router = useRouter();
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

    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.name) setTeacherName(data.name);
        if (data?.email) setTeacherEmail(data.email);
      })
      .catch(() => { });
  }, []);

  async function handleLogout() {
    if (teacherEmail && teacherEmail !== "teacher@example.com") {
      localStorage.setItem("lastLoginEmail", teacherEmail);
    }
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

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

          <div className="mt-auto pt-8 space-y-4">
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

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-[var(--paper-dark)] bg-[#f9f3e6]/90 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-[var(--paper-dark)] bg-white p-2 text-[var(--ink)] lg:hidden"
                  onClick={() => setOpen(true)}
                  aria-label="Open sidebar"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="min-w-0">
                  <h1 className="display-font truncate text-lg font-semibold text-[var(--ink)] sm:text-xl lg:text-2xl">
                    {schoolName}
                  </h1>

                  {/* Hidden on mobile, visible from sm and above */}
                  <p className="hidden sm:block text-sm text-[var(--stone)]">
                    Teacher Dashboard
                  </p>
                </div>
              </div>

              <div className="hidden lg:block flex-1 max-w-md">
                <StudentSearch />
              </div>

              <div className="flex items-center gap-3">
                <NotificationBell />

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

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="hidden lg:flex items-center gap-2 rounded-xl border border-[var(--paper-dark)] bg-white px-3 py-2 text-sm font-medium text-[var(--ink)] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            <div className="lg:hidden px-4 pb-4 sm:px-6">
              <StudentSearch />
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}