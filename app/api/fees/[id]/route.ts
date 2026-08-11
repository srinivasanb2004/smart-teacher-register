import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../../lib/withTeacher"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return withTeacher(async (teacherId) => {
    const { id } = await params
    const body = await req.json()

    const existing = await prisma.fee.findFirst({
      where: { id: Number(id), teacherId },
    })

    if (!existing) {
      return NextResponse.json(
        { error: "Fee record not found" },
        { status: 404 }
      )
    }

    // Amount received now
    const received = Number(body.paidAmount)

    if (!received || received <= 0) {
      return NextResponse.json(
        { error: "Enter a valid payment amount" },
        { status: 400 }
      )
    }

    // Add to existing paid amount
    const newPaidAmount = existing.paidAmount + received

    // Prevent paying more than total fee
    if (newPaidAmount > existing.totalAmount) {
      return NextResponse.json(
        { error: "Paid amount cannot exceed total fee" },
        { status: 400 }
      )
    }

    let status = "Unpaid"

    if (newPaidAmount === 0) {
      status = "Unpaid"
    } else if (newPaidAmount >= existing.totalAmount) {
      status = "Paid"
    } else {
      status = "Partial"
    }

    const fee = await prisma.fee.update({
      where: { id: Number(id) },
      data: {
        paidAmount: newPaidAmount,
        status,
        paymentDate: status === "Paid" ? new Date() : null,
      },
    })

    return NextResponse.json(fee)
  })
}