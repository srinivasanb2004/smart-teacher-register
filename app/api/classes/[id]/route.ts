import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../lib/withTeacher"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params
    const classId = Number(id)

    const schoolClass = await prisma.schoolClass.findFirst({
      where: { id: classId, teacherId },
    })

    if (!schoolClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 })
    }

    // Deleting a class cascades (via the schema's onDelete: Cascade) to its
    // sections and every student, attendance, mark, and fee record tied to it.
    const deleted = await prisma.schoolClass.delete({
      where: { id: classId },
    })

    return NextResponse.json(deleted)
  })
}
