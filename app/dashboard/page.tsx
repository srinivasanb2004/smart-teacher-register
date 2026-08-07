import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../lib/prisma"
import { getCurrentTeacher } from "../../lib/auth"
import DashboardCharts from "../../components/DashboardCharts"
import WelcomeHeader from "../../components/WelcomeHeader"

export default async function DashboardPage() {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const teacherId = teacher.teacherId

  const totalStudents = await prisma.student.count({ where: { teacherId } })
  const totalClasses = await prisma.schoolClass.count({ where: { teacherId } })
  const totalSections = await prisma.section.count({ where: { teacherId } })

  const paidFees = await prisma.fee.count({
    where: { teacherId, status: "Paid" },
  })

  const pendingFees = await prisma.fee.count({
    where: { teacherId, status: "Pending" },
  })

  const attendanceRecords = await prisma.attendance.findMany({
    where: { teacherId },
  })

  const presentCount = attendanceRecords.filter(
    (a: any) => a.status === "Present"
  ).length

  const attendancePercentage = attendanceRecords.length
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : 0

  const examCount = await prisma.exam.count({ where: { teacherId } })

  return (
    <div className="space-y-8">
      <WelcomeHeader />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/students/new"
          className="bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-teal-200 transition-all"
        >
          <p className="font-semibold text-stone-800">Add Student</p>
          <p className="text-sm text-stone-500 mt-1">
            Create new record
          </p>
        </Link>

        <Link
          href="/dashboard/attendance"
          className="bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-teal-200 transition-all"
        >
          <p className="font-semibold text-stone-800">Take Attendance</p>
          <p className="text-sm text-stone-500 mt-1">
            Mark daily attendance
          </p>
        </Link>

        <Link
          href="/dashboard/marks"
          className="bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-teal-200 transition-all"
        >
          <p className="font-semibold text-stone-800">Enter Marks</p>
          <p className="text-sm text-stone-500 mt-1">
            Bulk marks entry
          </p>
        </Link>

        <Link
          href="/dashboard/reports"
          className="bg-white border border-stone-200 rounded-2xl p-4 hover:shadow-md hover:border-teal-200 transition-all"
        >
          <p className="font-semibold text-stone-800">Reports</p>
          <p className="text-sm text-stone-500 mt-1">
            View analytics
          </p>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-medium text-teal-700">
            Total Students
          </p>
          <h2 className="text-3xl font-bold text-stone-900 mt-2">
            {totalStudents}
          </h2>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-medium text-green-700">
            Attendance
          </p>
          <h2 className="text-3xl font-bold text-stone-900 mt-2">
            {attendancePercentage}%
          </h2>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-medium text-amber-700">
            Pending Fees
          </p>
          <h2 className="text-3xl font-bold text-stone-900 mt-2">
            {pendingFees}
          </h2>
        </div>

        <div className="bg-pink-50 border border-pink-100 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-medium text-pink-700">
            Active Exams
          </p>
          <h2 className="text-3xl font-bold text-stone-900 mt-2">
            {examCount}
          </h2>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Classes</p>
          <p className="text-2xl font-bold text-stone-900 mt-2">
            {totalClasses}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Sections</p>
          <p className="text-2xl font-bold text-stone-900 mt-2">
            {totalSections}
          </p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-stone-500">Fees Collected</p>
          <p className="text-2xl font-bold text-stone-900 mt-2">
            {paidFees}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-stone-900">
            Analytics Overview
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Student, attendance, and fee analytics
          </p>
        </div>

        <DashboardCharts
          totalStudents={totalStudents}
          totalClasses={totalClasses}
          paidFees={paidFees}
          pendingFees={pendingFees}
          attendancePercentage={attendancePercentage}
        />
      </div>
    </div>
  )
}