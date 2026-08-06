import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../lib/withTeacher"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params
    const sectionId = Number(id)

    const section = await prisma.section.findFirst({
      where: { id: sectionId, teacherId },
    })

    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 })
    }

    // Deleting a section cascades (via the schema's onDelete: Cascade) to
    // every student, attendance, mark, and fee record tied to it.
    const deleted = await prisma.section.delete({
      where: { id: sectionId },
    })

    return NextResponse.json(deleted)
  })
}
