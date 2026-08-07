import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../lib/prisma"
import { getCurrentTeacher } from "../../../lib/auth"
import FeesFilterBar from "../../../components/FeesFilterBar"

export default async function FeesDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ classId?: string; sectionId?: string; term?: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { classId, sectionId, term } = await searchParams

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

  // Load ALL students from selected class/section
  const students = await prisma.student.findMany({
    where: {
      teacherId: teacher.teacherId,
      ...(classId ? { classId: Number(classId) } : {}),
      ...(sectionId ? { sectionId: Number(sectionId) } : {}),
    },
    include: {
      class: true,
      section: true,
    },
    orderBy: { name: "asc" },
  })

  // Load fees for selected term
  const fees = await prisma.fee.findMany({
    where: {
      teacherId: teacher.teacherId,
      ...(term ? { term } : {}),
      student: {
        ...(classId ? { classId: Number(classId) } : {}),
        ...(sectionId ? { sectionId: Number(sectionId) } : {}),
      },
    },
  })

  // Create fee lookup map by studentId
  const feeMap = new Map<number, (typeof fees)[number]>(
    fees.map((f) => [f.studentId, f])
  )
  // Merge students with fee status
  const feeRows = students.map((student) => {
    const fee = feeMap.get(student.id)

    return {
      student,
      fee,
      status: fee?.status ?? "Unpaid",
      amount: fee?.amount ?? 0,
      term: fee?.term ?? term ?? "-",
    }
  })

  // Summary cards
  const totalStudents = feeRows.length

  const paidRows = feeRows.filter((r) => r.status === "Paid")
  const unpaidRows = feeRows.filter((r) => r.status !== "Paid")

  const paidAmount = paidRows.reduce((s, r) => s + r.amount, 0)
  const pendingAmount = unpaidRows.reduce((s, r) => s + r.amount, 0)
  const totalAmount = paidAmount + pendingAmount

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fees Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Class-wise fee status dashboard
        </p>
      </div>

      <FeesFilterBar classes={classes} sections={sections} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">Students</p>
          <p className="text-2xl font-bold mt-2">{totalStudents}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm text-green-700">Paid Students</p>
          <p className="text-2xl font-bold text-green-800 mt-2">
            {paidRows.length}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-700">Unpaid Students</p>
          <p className="text-2xl font-bold text-red-800 mt-2">
            {unpaidRows.length}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm text-blue-700">Collection %</p>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            {totalStudents
              ? Math.round((paidRows.length / totalStudents) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Student Fee Status
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {classId && sectionId && term
              ? "Showing all students for selected Class, Section and Term"
              : "Select Class, Section and Term to view fee status"}
          </p>
        </div>

        {feeRows.length === 0 ? (
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
                  <th className="text-left p-4">Term</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {feeRows.map((row) => (
                  <tr key={row.student.id} className="border-t">
                    <td className="p-4 font-medium">
                      {row.student.name}
                    </td>

                    <td className="p-4">
                      {row.student.class.name}-{row.student.section.name}
                    </td>

                    <td className="p-4">{row.term}</td>

                    <td className="p-4">
                      {row.amount > 0 ? `₹${row.amount}` : "-"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${row.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/dashboard/students/${row.student.id}/fees`}
                        className="text-blue-600 hover:underline"
                      >
                        Open Ledger
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