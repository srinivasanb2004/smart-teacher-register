import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getCurrentTeacher } from "../../../lib/auth"

export async function GET() {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const fees = await prisma.fee.findMany({
    where: { teacherId: teacher.teacherId },
    include: {
      student: {
        include: {
          class: true,
          section: true,
        },
      },
    },
    orderBy: { id: "desc" },
  })

  return NextResponse.json(fees)
}

export async function POST(req: NextRequest) {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()

  const term = String(body.term)

  const existingFee = await prisma.fee.findFirst({
    where: {
      teacherId: teacher.teacherId,
      studentId: Number(body.studentId),
      term,
    },
  })

  let fee

  if (existingFee) {
    fee = await prisma.fee.update({
      where: { id: existingFee.id },
      data: {
        amount: Number(body.amount),
      },
    })
  } else {
    fee = await prisma.fee.create({
      data: {
        teacherId: teacher.teacherId,
        studentId: Number(body.studentId),
        term,
        amount: Number(body.amount),
        status: "Pending",
      },
    })
  }

  return NextResponse.json(fee)
}