import Link from "next/link"
import AnimatedCounter from "../components/AnimatedCounter"
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
    <main className="min-h-screen bg-[#F5F7FB] text-stone-900 transition-colors duration-300">

      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg">
              S
            </div>
            <div>
              <p className="font-semibold leading-none text-stone-900">
                Smart Teacher Register
              </p>
              <p className="text-xs text-stone-500 mt-1">
                School ERP for Teachers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-stone-700 hover:text-teal-600"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-100 via-white to-amber-100 transition-all duration-300" />
        <div className="absolute inset-0 ledger-lines" />


        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-teal-100 text-teal-700 rounded-full px-4 py-2 text-sm font-medium shadow-sm">
                <CheckCircle size={16} />
                Built for Individual Teachers
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mt-6 text-stone-900">
                Manage Your Class
                <span className="text-teal-600">
                  {" "}Smarter
                </span>
              </h1>

              <p className="text-lg text-stone-600 mt-6 max-w-xl leading-relaxed">
                Take attendance, enter marks, track fees, generate reports, and
                manage students from one beautiful dashboard designed for school
                teachers.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href="/register"
                  className="bg-teal-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-2 shadow-lg shadow-teal-500/20"
                >
                  Create Your Free Account
                  <ArrowRight size={18} />
                </Link>

                <Link
                  href="/login"
                  className="bg-white border border-stone-200 px-6 py-3 rounded-2xl font-semibold text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  Teacher Login
                </Link>
              </div>
            </div>

            {/* Right Dashboard Card */}
            <div className="relative">
              <div className="absolute -inset-4 bg-teal-200/40 blur-3xl rounded-[2rem]" />

              <div className="relative bg-white rounded-[2rem] border border-stone-200 shadow-2xl overflow-hidden p-6 transition-colors duration-300">

                <p className="text-sm text-stone-500">
                  Dashboard Preview
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
                    <p className="text-xs text-teal-700">
                      Students
                    </p>
                    <p className="text-2xl font-bold mt-2 text-stone-900">
                      248
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                    <p className="text-xs text-green-700">
                      Attendance
                    </p>
                    <p className="text-2xl font-bold mt-2 text-stone-900">
                      92%
                    </p>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
                    <p className="text-xs text-amber-700">
                      Pending Fees
                    </p>
                    <p className="text-2xl font-bold mt-2 text-stone-900">
                      18
                    </p>
                  </div>

                  <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                    <p className="text-xs text-pink-700">
                      Exams
                    </p>
                    <p className="text-2xl font-bold mt-2 text-stone-900">
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

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-teal-600">
                <AnimatedCounter end={500} suffix="+" />
              </p>
              <p className="text-sm text-stone-500 mt-2">
                Students Managed
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-teal-600">
                <AnimatedCounter end={20} suffix="+" />
              </p>
              <p className="text-sm text-stone-500 mt-2">
                Classes Supported
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-teal-600">
                <AnimatedCounter end={95} suffix="%" />
              </p>
              <p className="text-sm text-stone-500 mt-2">
                Attendance Accuracy
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center shadow-sm transition-colors duration-300">
              <p className="text-3xl font-bold text-teal-600">
                <AnimatedCounter end={100} suffix="%" />
              </p>
              <p className="text-sm text-stone-500 mt-2">
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
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
              See the Dashboard in Action
            </h2>
            <p className="text-stone-600 mt-4">
              A clean, modern interface designed for daily classroom work.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-[2rem] p-3 shadow-2xl overflow-hidden transition-colors duration-300">
            <img
              src="/dashboard-preview.png"
              alt="Smart Teacher Register Dashboard"
              className="w-full rounded-[1.5rem]"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 text-center text-sm text-stone-500">
          © 2026 Smart Teacher Register • Built by Srinivasan B
        </div>
      </footer>

    </main>
  )
}