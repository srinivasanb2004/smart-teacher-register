import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { createSessionToken, verifyPassword, SESSION_COOKIE } from "../../../../lib/auth"

export async function POST(req: Request) {
  const body = await req.json()
  const email = (body.email || "").trim().toLowerCase()
  const password = body.password || ""

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    )
  }

  const teacher = await prisma.teacher.findUnique({ where: { email } })

  if (!teacher) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  const valid = await verifyPassword(password, teacher.passwordHash)

  if (!valid) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    )
  }

  const token = await createSessionToken({
    teacherId: teacher.id,
    email: teacher.email,
    name: teacher.name,
  })

  const res = NextResponse.json({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email,
  })

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  return res
}
