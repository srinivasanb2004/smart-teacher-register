import { NextResponse } from "next/server"
import { getCurrentTeacher } from "../../../../lib/auth"

export async function GET() {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json(teacher)
}
