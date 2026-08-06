import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"

export default async function PrintableMarksheet({
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
        include: { exam: true },
        orderBy: [{ examId: "asc" }, { subject: "asc" }],
      },
    },
  })

  if (!student) return <div>Student not found</div>

  // Group marks by exam/term
  const groupedMarks = student.marks.reduce((acc: any, mark: any) => {
    const examName = mark.exam.name

    if (!acc[examName]) {
      acc[examName] = []
    }

    acc[examName].push(mark)
    return acc
  }, {})

  const examEntries = Object.entries(groupedMarks)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Marksheet</h1>

          <p className="text-slate-500 mt-1">
            Term-wise academic report
          </p>
        </div>

        <Link
          href="/dashboard/reports"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl border"
        >
          Back to Reports
        </Link>
      </div>

      {/* Student Info */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-2xl font-bold">
            Smart Teacher Register
          </h2>

          <p className="text-slate-500 mt-1">
            Student Academic Report
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
          <p>
            <span className="font-semibold">Name:</span> {student.name}
          </p>

          <p>
            <span className="font-semibold">Admission No:</span> {student.admissionNo}
          </p>

          <p>
            <span className="font-semibold">Class:</span> {student.class.name}
          </p>

          <p>
            <span className="font-semibold">Section:</span> {student.section.name}
          </p>
        </div>
      </div>

      {examEntries.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
          No marks available for this student.
        </div>
      ) : (
        examEntries.map(([examName, marks]: any) => {
          const total = marks.reduce(
            (s: number, m: any) => s + m.marks,
            0
          )

          const percentage = marks.length
            ? Math.round(total / marks.length)
            : 0

          return (
            <div
              key={examName}
              className="bg-white rounded-2xl border shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b bg-slate-50">
                <h3 className="text-xl font-semibold">
                  {examName}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Term-wise marksheet
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="text-left p-3 border-b">
                        Subject
                      </th>

                      <th className="text-left p-3 border-b">
                        Marks
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {marks.map((m: any) => (
                      <tr key={m.id} className="border-b last:border-b-0">
                        <td className="p-3">{m.subject}</td>
                        <td className="p-3 font-medium">
                          {m.marks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t flex justify-end">
                <div className="w-full sm:w-72 border rounded-xl p-4 text-sm space-y-2 bg-slate-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span>{total}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Subjects</span>
                    <span>{marks.length}</span>
                  </div>

                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Percentage</span>
                    <span className="font-semibold text-blue-700">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}