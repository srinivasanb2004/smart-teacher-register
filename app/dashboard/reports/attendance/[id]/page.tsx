import { redirect } from "next/navigation"
import Link from "next/link"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
]

export default async function AttendanceReport({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { id } = await params
  const { month, year } = await searchParams

  const currentDate = new Date()
  const selectedMonth = Number(month ?? currentDate.getMonth() + 1)
  const selectedYear = Number(year ?? currentDate.getFullYear())

  const startDate = new Date(selectedYear, selectedMonth - 1, 1)
  const endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59)

  const student = await prisma.student.findFirst({
    where: { id: Number(id), teacherId: teacher.teacherId },
    include: {
      class: true,
      section: true,
      attendances: {
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
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

  const selectedMonthLabel =
    months.find((m) => Number(m.value) === selectedMonth)?.label ??
    "Month"

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div className="bg-white rounded-2xl border shadow-sm p-6 flex-1 w-full">
          <h1 className="text-3xl font-bold">Attendance Report</h1>

          <p className="text-slate-500 mt-1">
            {student.name} • Class {student.class.name} - {student.section.name}
          </p>

          <p className="text-sm text-slate-400 mt-2">
            Showing attendance for <strong>{selectedMonthLabel} {selectedYear}</strong>
          </p>
        </div>

        <Link
          href="/dashboard/reports"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl border"
        >
          Back to Reports
        </Link>
      </div>

      {/* Month Filter */}
      <form className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Month
          </label>

          <select
            name="month"
            defaultValue={String(selectedMonth)}
            className="w-full border rounded-xl px-3 py-2"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="text-sm font-medium text-slate-700 block mb-1">
            Year
          </label>

          <input
            type="number"
            name="year"
            defaultValue={String(selectedYear)}
            className="w-full border rounded-xl px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700"
        >
          Apply
        </button>
      </form>

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
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Attendance Entries
          </h2>
        </div>

        {student.attendances.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No attendance records found for {selectedMonthLabel} {selectedYear}.
          </div>
        ) : (
          <div className="overflow-x-auto">
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
        )}
      </div>
    </div>
  )
}