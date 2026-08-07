import Link from "next/link";
import { BookOpen, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="ledger-bg flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="paper-card rounded-[28px] p-8 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--teal)] text-white">
              <BookOpen className="h-8 w-8 text-amber-300" />
            </div>

            <h1 className="display-font mt-5 text-4xl font-semibold text-[var(--ink)]">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-[var(--stone)]">
              Sign in to access your teacher register.
            </p>
          </div>

          <form className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Email Address
              </label>

              <div className="flex items-center rounded-xl border border-[var(--paper-dark)] bg-white px-3 py-3 focus-within:border-[var(--teal)]">
                <Mail className="mr-3 h-5 w-5 text-[var(--stone)]" />
                <input
                  type="email"
                  placeholder="teacher@example.com"
                  className="w-full bg-transparent outline-none placeholder:text-[var(--stone)]/70"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--ink)]">
                Password
              </label>

              <div className="flex items-center rounded-xl border border-[var(--paper-dark)] bg-white px-3 py-3 focus-within:border-[var(--teal)]">
                <Lock className="mr-3 h-5 w-5 text-[var(--stone)]" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-transparent outline-none placeholder:text-[var(--stone)]/70"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--stone)]">
                <input type="checkbox" className="rounded border-[var(--paper-dark)]" />
                Remember me
              </label>

              <Link href="/forgot-password" className="text-[var(--teal)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 font-medium teal-btn transition"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--paper-dark)]" />
            <span className="text-xs text-[var(--stone)]">OR</span>
            <div className="h-px flex-1 bg-[var(--paper-dark)]" />
          </div>

          <button className="w-full rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 text-sm font-medium text-[var(--ink)] transition hover:bg-[var(--paper)]">
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-[var(--stone)]">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-[var(--teal)] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}