import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../../lib/withTeacher"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params

    const student = await prisma.student.findFirst({
      where: { id: Number(id), teacherId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const marks = await prisma.mark.findMany({
      where: { studentId: Number(id), teacherId },
      orderBy: { subject: "asc" },
    })

    return NextResponse.json(marks)
  })
}
