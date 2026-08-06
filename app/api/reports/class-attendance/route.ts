import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../lib/auth"
import * as XLSX from "xlsx"

export async function GET(req: NextRequest) {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)

  const classId = Number(searchParams.get("classId"))
  const sectionId = Number(searchParams.get("sectionId"))
  const month = Number(searchParams.get("month"))
  const year = Number(searchParams.get("year"))
  const format = searchParams.get("format") || "excel"

  if (!classId || !sectionId || !month || !year) {
    return NextResponse.json(
      { error: "Missing required filters" },
      { status: 400 }
    )
  }

  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0, 23, 59, 59)

  const students = await prisma.student.findMany({
    where: {
      teacherId: teacher.teacherId,
      classId,
      sectionId,
    },
    include: {
      attendances: {
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      class: true,
      section: true,
    },
    orderBy: { name: "asc" },
  })

  const rows = students.map((student) => {
    const total = student.attendances.length

    const present = student.attendances.filter(
      (a) => a.status === "Present"
    ).length

    const absent = total - present

    const percentage = total
      ? Math.round((present / total) * 100)
      : 0

    return {
      Student: student.name,
      Class: student.class.name,
      Section: student.section.name,
      Month: `${month}/${year}`,
      TotalDays: total,
      Present: present,
      Absent: absent,
      Percentage: `${percentage}%`,
    }
  })

  // Excel download
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  })

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="attendance-${classId}-${sectionId}-${month}-${year}.xlsx"`,
    },
  })
}