import { redirect } from "next/navigation"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"

function getGrade(p: number) {
  if (p >= 90) return "A+"
  if (p >= 80) return "A"
  if (p >= 70) return "B+"
  if (p >= 60) return "B"
  if (p >= 50) return "C"
  return "D"
}

export default async function StudentMarksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { id } = await params

  const student = await prisma.student.findFirst({
    where: { id: Number(id), teacherId: teacher.teacherId },
    include: {
      class: true,
      section: true,
      marks: {
        include: {
          exam: true,
        },
        orderBy: [
          { examId: "asc" },
          { subject: "asc" },
        ],
      },
    },
  })

  if (!student) return <div>Student not found</div>

  const total = student.marks.reduce(
    (sum: number, m: any) => sum + m.marks,
    0
  )

  const percentage = student.marks.length
    ? Math.round(total / student.marks.length)
    : 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h1 className="text-3xl font-bold">Marksheet</h1>
        <p className="text-slate-500 mt-1">
          {student.name} • Class {student.class.name} - {student.section.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-slate-500">Total Marks</p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-slate-500">Percentage</p>
          <p className="text-3xl font-bold mt-2">{percentage}%</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-slate-500">Grade</p>
          <p className="text-3xl font-bold mt-2">
            {getGrade(percentage)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Exam</th>
              <th className="text-left p-4">Subject</th>
              <th className="text-left p-4">Marks</th>
            </tr>
          </thead>

          <tbody>
            {student.marks.map((m: any) => (
              <tr key={m.id} className="border-t">
                <td className="p-4">{m.exam.name}</td>
                <td className="p-4">{m.subject}</td>
                <td className="p-4 font-semibold">{m.marks} / 100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}