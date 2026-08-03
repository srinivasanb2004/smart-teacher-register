import { NextResponse } from "next/server"
import { getCurrentTeacher } from "./auth"

// Every API route handler wraps its logic with this so that:
// - unauthenticated requests are rejected with 401
// - the handler always gets a trusted teacherId to scope queries by
export async function withTeacher<T>(
  handler: (teacherId: number) => Promise<T>
): Promise<T | NextResponse> {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    )
  }

  return handler(teacher.teacherId)
}
