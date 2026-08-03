import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"
import { withTeacher } from "../../../lib/withTeacher"

export async function GET() {
  return withTeacher(async (teacherId) => {
    const settings = await prisma.appSettings.findUnique({
      where: { teacherId },
    })

    return NextResponse.json(settings)
  })
}

export async function POST(req: Request) {
  return withTeacher(async (teacherId) => {
    const body = await req.json()

    const settings = await prisma.appSettings.upsert({
      where: { teacherId },
      update: {
        schoolName: body.schoolName,
        teacherName: body.teacherName,
        email: body.email,
      },
      create: {
        teacherId,
        schoolName: body.schoolName,
        teacherName: body.teacherName,
        email: body.email,
      },
    })

    return NextResponse.json(settings)
  })
}
