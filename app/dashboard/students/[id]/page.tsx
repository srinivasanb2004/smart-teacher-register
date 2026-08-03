import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../lib/auth"

export default async function StudentProfile({
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
      year: true,
      class: true,
      section: true,
      fees: true,
    },
  })

  if (!student) {
    return <div>Student not found</div>
  }

  const paid = student.fees.filter((f: any) => f.status === "Paid").length
  const pending = student.fees.filter((f: any) => f.status === "Pending").length

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{student.name}</h1>
            <p className="text-slate-500 mt-1">
              {student.admissionNo} • Roll {student.rollNo}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">
              Class {student.class.name} - {student.section.name}
            </p>
            <p className="text-sm text-slate-500">{student.year.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-3">
          <h2 className="text-xl font-semibold">Student Details</h2>
          <p><span className="font-medium">Gender:</span> {student.gender}</p>
          <p><span className="font-medium">Date of Birth:</span> {new Date(student.dob).toLocaleDateString()}</p>
          <p><span className="font-medium">Address:</span> {student.address}</p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-3">
          <h2 className="text-xl font-semibold">Parent Details</h2>
          <p><span className="font-medium">Parent Name:</span> {student.parentName}</p>
          <p><span className="font-medium">Parent Phone:</span> {student.parentPhone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-green-700 font-medium">Paid Months</p>
          <p className="text-3xl font-bold text-green-800 mt-2">{paid}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <p className="text-red-700 font-medium">Pending Months</p>
          <p className="text-3xl font-bold text-red-800 mt-2">{pending}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={`/dashboard/students/${student.id}/attendance`} className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700">
          Attendance
        </Link>

        <Link href={`/dashboard/students/${student.id}/marks`} className="bg-purple-600 text-white px-4 py-3 rounded-xl hover:bg-purple-700">
          Marks
        </Link>

        <Link href={`/dashboard/students/${student.id}/fees`} className="bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700">
          Fees
        </Link>
      </div>
    </div>
  )
}