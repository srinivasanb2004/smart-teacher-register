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
      return NextResponse.json({ error: "Fee record not found" }, { status: 404 })
    }

    const fee = await prisma.fee.update({
      where: { id: Number(id) },
      data: {
        status: body.status,
        paymentDate: body.status === "Paid" ? new Date() : null,
      },
    })

    return NextResponse.json(fee)
  })
}
