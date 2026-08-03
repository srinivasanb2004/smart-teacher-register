import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const years = await prisma.academicYear.findMany({
      where: { teacherId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(years)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    const year = await prisma.academicYear.create({
      data: {
        name: body.name,
        isActive: body.isActive ?? false,
        teacherId,
      },
    })

    return NextResponse.json(year)
  })
}
