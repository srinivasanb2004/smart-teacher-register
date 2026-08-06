import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

const VALID_TERMS = ["Term 1", "Term 2", "Term 3"]

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()
    const term = body.term
    const amount = Number(body.amount)

    if (!VALID_TERMS.includes(term)) {
      return NextResponse.json({ error: "Invalid term" }, { status: 400 })
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Enter a valid fee amount" },
        { status: 400 }
      )
    }

    const student = await prisma.student.findFirst({
      where: { id: Number(body.studentId), teacherId },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Teacher enters the amount for a term manually. If a fee row for this
    // student + term already exists, just update its amount (status/payment
    // date are left untouched); otherwise create a new one as "Pending".
    const fee = await prisma.fee.upsert({
      where: {
        studentId_term: {
          studentId: Number(body.studentId),
          term,
        },
      },
      update: {
        amount,
      },
      create: {
        studentId: Number(body.studentId),
        term,
        amount,
        status: "Pending",
        teacherId,
      },
    })

    return NextResponse.json(fee)
  })
}

export async function GET() {
  return withTeacher(async (teacherId) => {
    const fees = await prisma.fee.findMany({
      where: { teacherId },
      include: {
        student: true,
      },
    })

    return NextResponse.json(fees)
  })
}
