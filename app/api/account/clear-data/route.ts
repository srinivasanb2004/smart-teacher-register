import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../lib/withTeacher"

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json().catch(() => ({}))

    // Require an explicit typed confirmation so this can't be triggered by
    // accident (e.g. a stray click or a replayed request).
    if (body.confirm !== "DELETE") {
      return NextResponse.json(
        { error: "Confirmation text did not match" },
        { status: 400 }
      )
    }

    // Delete in leaf-to-root order. Foreign keys are set up to cascade
    // automatically, but we delete explicitly here too for clarity and to
    // avoid depending on cascade ordering across unrelated branches (e.g.
    // Exam -> Mark isn't reachable by deleting AcademicYear).
    await prisma.fee.deleteMany({ where: { teacherId } })
    await prisma.mark.deleteMany({ where: { teacherId } })
    await prisma.attendance.deleteMany({ where: { teacherId } })
    await prisma.student.deleteMany({ where: { teacherId } })
    await prisma.section.deleteMany({ where: { teacherId } })
    await prisma.schoolClass.deleteMany({ where: { teacherId } })
    await prisma.academicYear.deleteMany({ where: { teacherId } })
    await prisma.exam.deleteMany({ where: { teacherId } })

    // Teacher account, login credentials, and Settings (school/teacher name)
    // are intentionally left untouched - this only clears entered records.

    return NextResponse.json({ success: true })
  })
}