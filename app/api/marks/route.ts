import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()
    const examId = Number(body.examId)

    const exam = await prisma.exam.findFirst({
      where: { id: examId, teacherId },
    })

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    const studentIds = body.records.map((item: any) => Number(item.studentId))

    const owned = await prisma.student.findMany({
      where: { id: { in: studentIds }, teacherId },
      select: { id: true },
    })
    const ownedIds = new Set(owned.map((s) => s.id))

    for (const item of body.records) {
      const studentId = Number(item.studentId)
      if (!ownedIds.has(studentId)) continue

      await prisma.mark.upsert({
        where: {
          studentId_examId_subject: {
            studentId,
            examId,
            subject: body.subject,
          },
        },
        update: {
          marks: Number(item.marks),
        },
        create: {
          studentId,
          examId,
          subject: body.subject,
          marks: Number(item.marks),
          teacherId,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  })
}
