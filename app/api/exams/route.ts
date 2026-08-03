import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const exams = await prisma.exam.findMany({
      where: { teacherId },
      orderBy: { id: "asc" },
    })

    return NextResponse.json(exams)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    const exam = await prisma.exam.create({
      data: {
        name: body.name,
        teacherId,
      },
    })

    return NextResponse.json(exam)
  })
}
