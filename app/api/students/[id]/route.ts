import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../lib/withTeacher"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params
    const studentId = Number(id)

    // Only allow deleting a student that belongs to this teacher
    const student = await prisma.student.findFirst({
      where: { id: studentId, teacherId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Related records cascade automatically via onDelete: Cascade in the
    // schema, but we delete explicitly here too for clarity/safety.
    await prisma.attendance.deleteMany({ where: { studentId } })
    await prisma.mark.deleteMany({ where: { studentId } })
    await prisma.fee.deleteMany({ where: { studentId } })

    const deleted = await prisma.student.delete({
      where: { id: studentId },
    })

    return NextResponse.json(deleted)
  })
}
