import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { createSessionToken, hashPassword, SESSION_COOKIE } from "../../../../lib/auth"

export async function POST(req: Request) {
  const body = await req.json()
  const name = (body.name || "").trim()
  const email = (body.email || "").trim().toLowerCase()
  const password = body.password || ""
  const schoolName = (body.schoolName || "").trim()

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 }
    )
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    )
  }

  const existing = await prisma.teacher.findUnique({ where: { email } })

  if (existing) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 }
    )
  }

  const passwordHash = await hashPassword(password)

  const teacher = await prisma.teacher.create({
    data: {
      name,
      email,
      passwordHash,
      schoolName: schoolName || null,
      settings: {
        create: {
          schoolName: schoolName || "",
          teacherName: name,
          email,
        },
      },
    },
  })

  // Give every new teacher one default academic year so the app is usable
  // immediately after signup, without any shared/global data.
  await prisma.academicYear.create({
    data: {
      name: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      isActive: true,
      teacherId: teacher.id,
    },
  })

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
