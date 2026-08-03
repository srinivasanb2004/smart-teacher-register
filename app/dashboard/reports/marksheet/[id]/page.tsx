import { redirect } from "next/navigation"
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

  const total = student.marks.reduce(
    (s: number, m: any) => s + m.marks,
    0
  )

  const percentage = student.marks.length
    ? Math.round(total / student.marks.length)
    : 0

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white">
      <div className="text-center border-b pb-4">
        <h1 className="text-3xl font-bold">Smart Teacher Register</h1>
        <p className="text-slate-500 mt-1">Student Marksheet</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
        <p><span className="font-semibold">Name:</span> {student.name}</p>
        <p><span className="font-semibold">Admission No:</span> {student.admissionNo}</p>
        <p><span className="font-semibold">Class:</span> {student.class.name}</p>
        <p><span className="font-semibold">Section:</span> {student.section.name}</p>
      </div>

      <table className="w-full border mt-6 text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="border p-3 text-left">Exam</th>
            <th className="border p-3 text-left">Subject</th>
            <th className="border p-3 text-left">Marks</th>
          </tr>
        </thead>

        <tbody>
          {student.marks.map((m: any) => (
            <tr key={m.id}>
              <td className="border p-3">{m.exam.name}</td>
              <td className="border p-3">{m.subject}</td>
              <td className="border p-3">{m.marks}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-64 border rounded-xl p-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span>{total}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Percentage</span>
            <span>{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}