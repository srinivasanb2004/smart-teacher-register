import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const totalStudents = await prisma.student.count({ where: { teacherId } })
    const totalSections = await prisma.section.count({ where: { teacherId } })

    const paidFees = await prisma.fee.count({
      where: { teacherId, status: "Paid" },
    })

    const pendingFees = await prisma.fee.count({
      where: { teacherId, status: "Pending" },
    })

    const totalAttendance = await prisma.attendance.count({
      where: { teacherId },
    })
    const presentAttendance = await prisma.attendance.count({
      where: { teacherId, status: "Present" },
    })

    const attendancePercentage = totalAttendance
      ? Math.round((presentAttendance / totalAttendance) * 100)
      : 0

    return NextResponse.json({
      totalStudents,
      totalSections,
      paidFees,
      pendingFees,
      attendancePercentage,
    })
  })
}
