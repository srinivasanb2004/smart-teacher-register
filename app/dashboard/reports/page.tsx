import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../lib/prisma"
import { getCurrentTeacher } from "../../../lib/auth"

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; sectionId?: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { classId, sectionId } = await searchParams

  // Load filters
  const [classes, sections] = await Promise.all([
    prisma.schoolClass.findMany({
      where: { teacherId: teacher.teacherId },
      orderBy: { name: "asc" },
    }),
    prisma.section.findMany({
      where: { teacherId: teacher.teacherId },
      orderBy: { name: "asc" },
    }),
  ])

  // Remove duplicate section names (A, B, C only once)
  const uniqueSections = Array.from(
    new Map(sections.map((s) => [s.name, s])).values()
  )

  // Load filtered students
  const students = await prisma.student.findMany({
    where: {
      teacherId: teacher.teacherId,
      ...(classId ? { classId: Number(classId) } : {}),
      ...(sectionId ? { sectionId: Number(sectionId) } : {}),
    },
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
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-slate-500 mt-1">
          View attendance and marksheet reports class-wise
        </p>
      </div>

      {/* Filters */}
      <form className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Class
          </label>

          <select
            name="classId"
            defaultValue={classId ?? ""}
            className="w-full border rounded-xl px-3 py-2"
          >
            <option value="">All Classes</option>

            {classes.map((cls: any) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Section
          </label>

          <select
            name="sectionId"
            defaultValue={sectionId ?? ""}
            className="w-full border rounded-xl px-3 py-2"
          >
            <option value="">All Sections</option>

            {uniqueSections.map((sec: any) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700"
        >
          Apply
        </button>
      </form>

      {/* Download Attendance */}
      {classId && sectionId && (
        <div className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
          <form
            action="/api/reports/class-attendance"
            method="GET"
            className="flex flex-col md:flex-row gap-4 items-end w-full"
          >
            <input type="hidden" name="classId" value={classId} />
            <input type="hidden" name="sectionId" value={sectionId} />

            <div className="w-full md:w-48">
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Month
              </label>

              <select
                name="month"
                defaultValue={String(new Date().getMonth() + 1)}
                className="w-full border rounded-xl px-3 py-2"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>

            <div className="w-full md:w-40">
              <label className="text-sm font-medium text-slate-700 block mb-1">
                Year
              </label>

              <input
                type="number"
                name="year"
                defaultValue={String(new Date().getFullYear())}
                className="w-full border rounded-xl px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700"
            >
              Download Excel
            </button>
          </form>
        </div>
      )}

      {/* Students Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Students</h2>

          <p className="text-sm text-slate-500 mt-1">
            {classId && sectionId
              ? "Showing students from selected class and section"
              : "Select class and section to narrow down reports"}
          </p>
        </div>

        {students.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No students found for the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    <td className="p-4 font-medium">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.class.name}
                    </td>

                    <td className="p-4">
                      {student.section.name}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/dashboard/reports/attendance/${student.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/dashboard/reports/marksheet/${student.id}`}
                        className="text-purple-600 hover:underline font-medium"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}