import { prisma } from "../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../lib/auth"

export async function GET() {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return new Response("Not authenticated", { status: 401 })
  }

  const students = await prisma.student.findMany({
    where: { teacherId: teacher.teacherId },
    include: {
      class: true,
      section: true,
    },
    orderBy: { name: "asc" },
  })

  const rows = [
    ["Admission No", "Name", "Class", "Section", "Parent Phone"],
    ...students.map((s: any) => [
      s.admissionNo,
      s.name,
      s.class.name,
      s.section.name,
      s.parentPhone,
    ]),
  ]

  const csv = rows.map((r) => r.join(",")).join("\n")

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=students.csv",
    },
  })
}
