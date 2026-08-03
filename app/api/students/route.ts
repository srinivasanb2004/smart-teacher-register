import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

const months = [
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
]

export async function GET() {
  return withTeacher(async (teacherId) => {
    const students = await prisma.student.findMany({
      where: { teacherId },
      include: {
        year: true,
        class: true,
        section: true,
        fees: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(students)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    // Verify the year/class/section belong to this teacher before linking
    const [year, schoolClass, section] = await Promise.all([
      prisma.academicYear.findFirst({
        where: { id: Number(body.yearId), teacherId },
      }),
      prisma.schoolClass.findFirst({
        where: { id: Number(body.classId), teacherId },
      }),
      prisma.section.findFirst({
        where: { id: Number(body.sectionId), teacherId },
      }),
    ])

    if (!year || !schoolClass || !section) {
      return NextResponse.json(
        { error: "Invalid academic year, class or section" },
        { status: 400 }
      )
    }

    const existing = await prisma.student.findFirst({
      where: { admissionNo: body.admissionNo, teacherId },
    })

    if (existing) {
      return NextResponse.json(
        { error: "A student with this admission number already exists" },
        { status: 409 }
      )
    }

    const student = await prisma.student.create({
      data: {
        admissionNo: body.admissionNo,
        rollNo: body.rollNo,
        name: body.name,
        gender: body.gender,
        dob: new Date(body.dob),
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        address: body.address,
        yearId: Number(body.yearId),
        classId: Number(body.classId),
        sectionId: Number(body.sectionId),
        teacherId,
      },
    })

    await prisma.fee.createMany({
      data: months.map((month) => ({
        studentId: student.id,
        month,
        amount: 1000,
        status: "Pending",
        teacherId,
      })),
    })

    return NextResponse.json(student)
  })
}
