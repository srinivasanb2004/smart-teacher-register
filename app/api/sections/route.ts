import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const sections = await prisma.section.findMany({
      where: { teacherId },
      include: {
        class: true,
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(sections)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    const schoolClass = await prisma.schoolClass.findFirst({
      where: { id: Number(body.classId), teacherId },
    })

    if (!schoolClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    const section = await prisma.section.create({
      data: {
        name: body.name,
        classId: Number(body.classId),
        teacherId,
      },
    })

    return NextResponse.json(section)
  })
}
