import { redirect } from "next/navigation"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"
import ExamFilter from "../../../../../components/ExamFilter"

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
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ examId?: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { id } = await params
  const { examId } = await searchParams

  const student = await prisma.student.findFirst({
    where: { id: Number(id), teacherId: teacher.teacherId },
    include: {
      class: true,
      section: true,
      marks: {
        where: examId ? { examId: Number(examId) } : undefined,
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

  // All exams this teacher has created, for the filter dropdown
  const exams = await prisma.exam.findMany({
    where: { teacherId: teacher.teacherId },
    orderBy: { id: "asc" },
  })

  const total = student.marks.reduce(
    (sum: number, m: any) => sum + m.marks,
    0
  )

  const percentage = student.marks.length
    ? Math.round(total / student.marks.length)
    : 0

  const selectedExamName = examId
    ? exams.find((e) => e.id === Number(examId))?.name
    : null

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marksheet</h1>
          <p className="text-stone-500 mt-1">
            {student.name} • Class {student.class.name} - {student.section.name}
          </p>
          {selectedExamName && (
            <p className="text-teal-600 text-sm font-medium mt-1">
              Showing results for: {selectedExamName}
            </p>
          )}
        </div>

        <ExamFilter exams={exams} studentId={student.id} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-stone-500">Total Marks</p>
          <p className="text-3xl font-bold mt-2">{total}</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-stone-500">Percentage</p>
          <p className="text-3xl font-bold mt-2">{percentage}%</p>
        </div>

        <div className="bg-white border rounded-2xl p-6">
          <p className="text-sm text-stone-500">Grade</p>
          <p className="text-3xl font-bold mt-2">
            {getGrade(percentage)}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        {student.marks.length === 0 ? (
          <div className="p-10 text-center text-stone-500">
            {selectedExamName
              ? `No marks have been entered yet for ${selectedExamName}.`
              : "No marks have been entered for this student yet."}
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-stone-100">
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
        )}
      </div>
    </div>
  )
}