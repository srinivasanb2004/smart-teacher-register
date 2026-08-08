import { BookOpen, CalendarDays, ClipboardList, IndianRupee, BarChart3, Download, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Student Management",
    desc: "Add students, sections, and manage all details in one place.",
  },
  {
    icon: CalendarDays,
    title: "Daily Attendance",
    desc: "Mark attendance quickly and view detailed reports.",
  },
  {
    icon: ClipboardList,
    title: "Marks & Exams",
    desc: "Enter marks easily and generate instant reports.",
  },
  {
    icon: IndianRupee,
    title: "Fee Tracking",
    desc: "Track payments, due fees, and payment history.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    desc: "Get insights with beautiful reports and charts.",
  },
  {
    icon: Download,
    title: "Export & Share",
    desc: "Export reports to PDF or Excel and share with parents.",
  },
];

export default function HomePage() {
  return (
    <main className="ledger-bg min-h-screen">
      <header className="teal-gradient sticky top-0 z-50 border-b border-white/10 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-amber-300/40 bg-white/5 p-2">
              <BookOpen className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <p className="display-font text-base font-semibold tracking-wide md:text-xl">
                SMART TEACHER REGISTER
              </p>
              <p className="text-xs text-amber-100/80">
                Your Class. Your Register. Digitally.
              </p>
            </div>
          </div>

          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#features" className="hover:text-amber-200 transition">
              Features
            </a>
            <a href="#how" className="hover:text-amber-200 transition">
              How It Works
            </a>
            <a href="#about" className="hover:text-amber-200 transition">
              About
            </a>
            <a href="#contact" className="hover:text-amber-200 transition">
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/login"
              className="rounded-full border border-amber-300/50 bg-white/10 px-3 py-2 text-xs font-medium text-white backdrop-blur transition hover:bg-white/20 hover:border-amber-300 md:px-5 md:text-sm"
            >
              Log In
            </a>

            <a
              href="/dashboard"
              className="rounded-full px-3 py-2 text-xs font-medium amber-btn transition md:px-5 md:text-sm"
            >
              Get Started
            </a>
          </div>

        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="relative z-10">
            <p className="mb-4 text-sm italic text-stone-600">
              From Paper to Powerful
            </p>

            <h1 className="display-font text-5xl font-semibold leading-tight text-[var(--ink)] md:text-6xl">
              A Teacher’s Register,
              <br />
              Now Smarter.
            </h1>

            <div className="mt-6 h-1 w-40 rounded-full bg-[var(--amber)]" />

            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--stone)]">
              Smart Teacher Register helps you manage attendance, marks,
              fees, and reports — all in one place. Simple. Reliable.
              Made for Teachers.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-xl px-6 py-3 font-medium teal-btn transition"
              >
                Create Account to Use
              </a>

              <a
                href="#features"
                className="rounded-xl border border-[var(--amber)] bg-white/60 px-6 py-3 font-medium text-[var(--teal)] transition hover:bg-white"
              >
                Watch Demo
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-[var(--stone)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />
                Easy to Use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />
                Secure & Private
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--teal)]" />
                Works Offline
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="paper-card overflow-hidden rounded-[28px]">
              <div className="flex min-h-[560px]">
                <aside className="hidden w-56 flex-col justify-between bg-[var(--teal)] p-6 text-white md:flex">
                  <div>
                    <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
                      <BookOpen className="h-5 w-5 text-amber-300" />
                      Dashboard
                    </div>

                    <nav className="space-y-3 text-sm">
                      {[
                        "Dashboard",
                        "Students",
                        "Attendance",
                        "Marks",
                        "Fees",
                        "Reports",
                        "Settings",
                      ].map((item, i) => (
                        <div
                          key={item}
                          className={`rounded-lg px-3 py-2 ${i === 0
                            ? "bg-white/15 text-white"
                            : "text-white/80 hover:bg-white/10"
                            }`}
                        >
                          {item}
                        </div>
                      ))}
                    </nav>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/70">
                    Academic Year
                    <div className="mt-1 text-sm text-white">2026 – 2027</div>
                  </div>
                </aside>

                <div className="flex-1 bg-[#fbf8ef] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--ink)]">
                        Good Morning, Teacher! 👋
                      </h3>
                      <p className="text-sm text-[var(--stone)]">
                        Here’s what’s happening in your classes today.
                      </p>
                    </div>

                    <div className="rounded-lg border border-[var(--paper-dark)] bg-white px-3 py-2 text-sm text-[var(--stone)]">
                      2026 – 2027
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      ["Students", "128"],
                      ["Present Today", "102"],
                      ["Pending Fees", "₹24,560"],
                      ["Upcoming Tests", "3"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[var(--paper-dark)] bg-white p-4"
                      >
                        <p className="text-xs text-[var(--stone)]">{label}</p>
                        <p className="mt-2 text-xl font-semibold text-[var(--ink)]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-[var(--paper-dark)] bg-white p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-semibold text-[var(--ink)]">
                        Today's Attendance Overview
                      </h4>
                      <button className="text-sm text-[var(--teal)]">
                        View All
                      </button>
                    </div>

                    <div className="space-y-4">
                      {[
                        ["10th - A", 28, 2, 93],
                        ["10th - B", 24, 6, 80],
                        ["9th - A", 25, 5, 83],
                        ["9th - B", 25, 5, 83],
                      ].map(([sec, p, a, pct]) => (
                        <div key={sec as string}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-[var(--ink)]">
                              {sec as string}
                            </span>
                            <span className="text-[var(--stone)]">
                              {pct as number}%
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-[var(--stone)]">
                            <span>Present: {p as number}</span>
                            <span>Absent: {a as number}</span>
                          </div>

                          <div className="mt-2 h-2 rounded-full bg-[var(--paper-dark)]">
                            <div
                              className="h-2 rounded-full bg-[var(--teal)]"
                              style={{ width: `${pct as number}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {[
                      "Mark Attendance",
                      "Add Marks",
                      "Collect Fees",
                      "View Reports",
                    ].map((action) => (
                      <button
                        key={action}
                        className="rounded-xl border border-[var(--paper-dark)] bg-white p-3 text-left text-sm font-medium text-[var(--ink)] transition hover:border-[var(--amber)] hover:shadow-sm"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm italic text-[var(--stone)]">
              Everything You Need
            </p>

            <h2 className="display-font mt-3 text-4xl font-semibold text-[var(--ink)] md:text-5xl">
              Built for Teachers.
              <br />
              Designed for Classrooms.
            </h2>

            <div className="mx-auto mt-6 h-1 w-28 rounded-full bg-[var(--amber)]" />
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="paper-card rounded-2xl p-6 text-center transition hover:-translate-y-1 hover:shadow-xl"
              >
                <feature.icon className="mx-auto h-10 w-10 text-[var(--teal)]" />

                <h3 className="mt-4 font-semibold text-[var(--ink)]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-[var(--stone)]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h2 className="display-font text-4xl font-semibold text-[var(--ink)]">
            How It Works
          </h2>
          <p className="mt-4 text-[var(--stone)]">
            Create your school, add students, and manage attendance, marks, and fees digitally.
          </p>
        </div>
      </section>

      <section id="about" className="py-20 bg-[#fbf6ea]">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="display-font text-4xl font-semibold text-[var(--ink)]">
            About Smart Teacher Register
          </h2>
          <p className="mt-6 text-lg leading-8 text-[var(--stone)]">
            Smart Teacher Register is a digital classroom register designed for teachers and schools.
          </p>
        </div>
      </section>



      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="overflow-hidden rounded-[32px] teal-gradient text-white">
            <div className="grid gap-10 p-10 lg:grid-cols-[1.1fr_1fr_1fr] lg:p-14">
              <div>
                <p className="text-sm italic text-amber-200">
                  Why Teachers Love It
                </p>

                <h2 className="display-font mt-3 text-4xl font-semibold leading-tight">
                  Save Time.
                  <br />
                  Stay Organized.
                  <br />
                  Focus on Teaching.
                </h2>

                <div className="mt-4 h-1 w-28 rounded-full bg-[var(--amber)]" />

                <ul className="mt-8 space-y-4 text-white/90">
                  {[
                    "Reduces paperwork",
                    "Saves time on repetitive tasks",
                    "Secure cloud backup",
                    "Access anytime, anywhere",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-amber-300" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="paper-card rounded-3xl bg-[#fffaf0] p-8 text-[var(--ink)] lg:col-span-1">
                <div className="text-5xl leading-none text-[var(--amber)]">“</div>

                <p className="mt-4 text-lg leading-8 text-[var(--stone)]">
                  Smart Teacher Register has made my daily work so much
                  easier. Attendance, marks, and fees — all in one app!
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--teal)] text-white font-semibold">
                    KR
                  </div>

                  <div>
                    <p className="font-semibold text-[var(--ink)]">
                      Mrs. Kavitha R.
                    </p>
                    <p className="text-sm text-[var(--stone)]">
                      High School Teacher
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <span className="h-2 w-2 rounded-full bg-[var(--teal)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--amber)]/60" />
                  <span className="h-2 w-2 rounded-full bg-[var(--paper-dark)]" />
                </div>
              </div>

              <div className="relative hidden items-center justify-center lg:flex">
                <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5" />

                <div className="relative flex flex-col items-center gap-6 text-amber-200/90">
                  <BookOpen className="h-28 w-28" />
                  <div className="flex gap-4">
                    <ClipboardList className="h-12 w-12" />
                    <CalendarDays className="h-12 w-12" />
                    <BarChart3 className="h-12 w-12" />
                  </div>
                  <p className="text-center text-sm text-white/70">
                    Attendance • Marks • Reports
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="paper-card flex flex-col items-start justify-between gap-6 rounded-[28px] border border-[var(--paper-dark)] bg-[#fbf6ea] p-8 lg:flex-row lg:items-center lg:p-10">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-[var(--teal)] p-4 text-white">
                <BookOpen className="h-7 w-7 text-amber-300" />
              </div>

              <div>
                <h3 className="display-font text-3xl font-semibold text-[var(--ink)]">
                  Ready to simplify your classroom management?
                </h3>
                <p className="mt-2 text-[var(--stone)]">
                  Join thousands of teachers who trust Smart Teacher Register.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 lg:items-end">
              <a
                href="/dashboard"
                className="rounded-xl px-6 py-3 font-medium teal-btn transition"
              >
                Get Started Free
              </a>
              <p className="text-sm text-[var(--stone)]">
                No credit card required
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="paper-card rounded-3xl p-8 text-center">
            <h2 className="display-font text-4xl font-semibold text-[var(--ink)]">
              Contact Us, when you face any Bugs or issues with the app. We are happy to help you !
            </h2>
            <p className="mt-6 text-[var(--stone)]">
              📧 bsrinivasan2004@gmail.com
            </p>
            <p className="text-[var(--stone)]">
              📞 +91 6381296152
            </p>
            <p className="text-[var(--stone)]">
              📍 Coimbatore, Tamil Nadu, India
            </p>
          </div>
        </div>
      </section>

      <footer className="teal-gradient border-t border-white/10 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-amber-300/40 bg-white/5 p-2">
                <BookOpen className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="display-font text-xl font-semibold">
                  SMART TEACHER REGISTER
                </p>
                <p className="text-sm text-white/70">
                  Your Class. Your Register. Digitally.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/70">
              Smart Teacher Register is a digital classroom companion for
              schools, tuition centres, and individual teachers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-amber-200">Product</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how" className="hover:text-white">How It Works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-200">Company</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li><a href="#about" className="hover:text-white">About Us</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-amber-200">Stay Connected</h4>
            <p className="mt-4 text-sm text-white/70">
              Get tips and updates for teachers.
            </p>

            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 outline-none focus:border-amber-300"
              />
              <button className="rounded-lg px-4 py-2 text-sm font-medium amber-btn">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
          © 2026 Smart Teacher Register. All rights reserved.
        </div>
      </footer>
    </main>
  );
}