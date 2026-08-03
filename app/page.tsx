import Link from "next/link"
import AnimatedCounter from "../components/AnimatedCounter"
import DarkModeToggle from "../components/DarkModeToggle"
import {
  CheckCircle,
  CalendarCheck,
  BookOpen,
  IndianRupee,
  FileBarChart,
  ArrowRight,
} from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F5F7FB] dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <p className="font-semibold leading-none text-slate-900 dark:text-white">
                Smart Teacher Register
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                School ERP for Teachers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DarkModeToggle />

            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-white to-purple-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-all duration-300" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-indigo-700 dark:text-indigo-300 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                <CheckCircle size={16} />
                Built for Individual Teachers
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mt-6 text-slate-900 dark:text-white">
                Manage Your Class
                <span className="text-indigo-600 dark:text-indigo-400">
                  {" "}Smarter
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 mt-6 max-w-xl leading-relaxed">
                Take attendance, enter marks, track fees, generate reports, and
                manage students from one beautiful dashboard designed for school
                teachers.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  Create Your Free Account
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/login"
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-2xl font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Teacher Login
                </Link>
              </div>
            </div>

            {/* Right Dashboard Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-200/40 dark:bg-indigo-900/20 blur-3xl rounded-[2rem]" />

              <div className="relative bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden p-6 transition-colors duration-300">

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Dashboard Preview
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-500/20">
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      Students
                    </p>
                    <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      248
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-4 border border-green-100 dark:border-green-500/20">
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Attendance
                    </p>
                    <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      92%
                    </p>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-4 border border-amber-100 dark:border-amber-500/20">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Pending Fees
                    </p>
                    <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      18
                    </p>
                  </div>

                  <div className="bg-pink-50 dark:bg-pink-500/10 rounded-2xl p-4 border border-pink-100 dark:border-pink-500/20">
                    <p className="text-xs text-pink-700 dark:text-pink-300">
                      Exams
                    </p>
                    <p className="text-2xl font-bold mt-2 text-slate-900 dark:text-white">
                      4
                    </p>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Students Managed
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                <AnimatedCounter end={20} suffix="+" />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Classes Supported
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                <AnimatedCounter end={95} suffix="%" />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Attendance Accuracy
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                <AnimatedCounter end={100} suffix="%" />
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Teacher Controlled
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Dashboard Screenshot */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              See the Dashboard in Action
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4">
              A clean, modern interface designed for daily classroom work.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-3 shadow-2xl overflow-hidden transition-colors duration-300">
            <img
              src="/dashboard-preview.png"
              alt="Smart Teacher Register Dashboard"
              className="w-full rounded-[1.5rem]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          © 2026 Smart Teacher Register • Built by Srinivasan B
        </div>
      </footer>

    </main>
  )
}