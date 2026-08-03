import { redirect } from "next/navigation"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"

export default async function AttendanceReport({
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
      attendances: {
        orderBy: { date: "desc" },
      },
    },
  })

  if (!student) return <div>Student not found</div>

  const total = student.attendances.length
  const present = student.attendances.filter(
    (a: any) => a.status === "Present"
  ).length
  const percentage = total
    ? Math.round((present / total) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h1 className="text-3xl font-bold">Attendance Report</h1>

        <p className="text-slate-500 mt-1">
          {student.name} • Class {student.class.name} - {student.section.name}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Days</p>
          <p className="text-2xl font-bold mt-2">{total}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm text-green-700">Present</p>
          <p className="text-2xl font-bold text-green-800 mt-2">
            {present}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm text-blue-700">Percentage</p>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            {percentage}%
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {student.attendances.map((a: any) => (
              <tr key={a.id} className="border-t">
                <td className="p-4">
                  {new Date(a.date).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <span
                    className={
                      a.status === "Present"
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}