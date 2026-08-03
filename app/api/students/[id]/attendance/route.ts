import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../../lib/withTeacher"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params
    const { searchParams } = new URL(req.url)

    const month = searchParams.get("month") // format: 2026-08

    const student = await prisma.student.findFirst({
      where: { id: Number(id), teacherId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    let where: any = {
      studentId: Number(id),
      teacherId,
    }

    if (month) {
      const [year, mon] = month.split("-").map(Number)

      const start = new Date(year, mon - 1, 1)
      const end = new Date(year, mon, 1)

      where.date = {
        gte: start,
        lt: end,
      }
    }

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { date: "desc" },
    })

    return NextResponse.json(records)
  })
}
