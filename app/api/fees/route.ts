import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    const student = await prisma.student.findFirst({
      where: { id: Number(body.studentId), teacherId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const fee = await prisma.fee.create({
      data: {
        amount: Number(body.amount),
        month: body.month,
        status: body.status,
        studentId: Number(body.studentId),
        teacherId,
      },
    })

    return NextResponse.json(fee)
  })
}

export async function GET() {
  return withTeacher(async (teacherId) => {
    const fees = await prisma.fee.findMany({
      where: { teacherId },
      include: {
        student: true,
      },
    })

    return NextResponse.json(fees)
  })
}
