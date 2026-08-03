import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const classes = await prisma.schoolClass.findMany({
      where: { teacherId },
      include: { year: true },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(classes)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    // Make sure the academic year being linked actually belongs to this teacher
    const year = await prisma.academicYear.findFirst({
      where: { id: Number(body.yearId), teacherId },
    })

    if (!year) {
      return NextResponse.json(
        { error: "Academic year not found" },
        { status: 404 }
      )
    }

    const newClass = await prisma.schoolClass.create({
      data: {
        name: body.name,
        yearId: Number(body.yearId),
        teacherId,
      },
    })

    return NextResponse.json(newClass)
  })
}
