import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SESSION_COOKIE = "str_session"

async function isValidSession(token: string | undefined) {
  if (!token) return false
  const secret = process.env.JWT_SECRET
  if (!secret) return false

  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
    return true
  } catch {
    return false
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get(SESSION_COOKIE)?.value
  const authed = await isValidSession(token)

  const isDashboard = pathname.startsWith("/dashboard")
  const isProtectedApi =
    pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")

  if (isDashboard && !authed) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (isProtectedApi && !authed) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login", "/register"],
}