import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()
    const date = new Date(body.date)

    const studentIds = body.records.map((item: any) => Number(item.studentId))

    // Make sure every student being marked actually belongs to this teacher
    const owned = await prisma.student.findMany({
      where: { id: { in: studentIds }, teacherId },
      select: { id: true },
    })
    const ownedIds = new Set(owned.map((s) => s.id))

    for (const item of body.records) {
      const studentId = Number(item.studentId)
      if (!ownedIds.has(studentId)) continue

      await prisma.attendance.upsert({
        where: {
          studentId_date: {
            studentId,
            date,
          },
        },
        update: {
          status: item.status,
        },
        create: {
          studentId,
          date,
          status: item.status,
          teacherId,
        },
      })
    }

    return NextResponse.json({
      success: true,
    })
  })
}
