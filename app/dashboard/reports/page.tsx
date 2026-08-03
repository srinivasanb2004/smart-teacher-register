import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../lib/prisma"
import { getCurrentTeacher } from "../../../lib/auth"

export default async function ReportsPage() {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  // Fetch only the fields needed for the table
  const students = await prisma.student.findMany({
    where: { teacherId: teacher.teacherId },
    select: {
      id: true,
      name: true,
      class: {
        select: { name: true },
      },
      section: {
        select: { name: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-500 mt-1">
            View attendance and marksheet reports
          </p>
        </div>

        <a
          href="/api/reports/students"
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700"
        >
          Export CSV
        </a>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Class</th>
              <th className="text-left p-4">Section</th>
              <th className="text-left p-4">Attendance</th>
              <th className="text-left p-4">Marksheet</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student: any) => (
              <tr key={student.id} className="border-t">
                <td className="p-4 font-medium">{student.name}</td>
                <td className="p-4">{student.class.name}</td>
                <td className="p-4">{student.section.name}</td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/reports/attendance/${student.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/reports/marksheet/${student.id}`}
                    className="text-purple-600 hover:underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}