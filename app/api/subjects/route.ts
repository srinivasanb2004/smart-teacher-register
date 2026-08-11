import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const subjects = await prisma.subject.findMany({
      where: { teacherId },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(subjects)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: "Subject name is required" },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name: body.name.trim(),
        teacherId,
      },
    })

    return NextResponse.json(subject)
  })
}