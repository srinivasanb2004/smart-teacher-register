import { redirect } from "next/navigation"
import { prisma } from "../../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../../lib/auth"

export default async function EditStudent({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { id } = await params

  const student = await prisma.student.findFirst({
    where: { id: Number(id), teacherId: teacher.teacherId },
  })

  if (!student) return <div>Student not found</div>

  return (
    <div className="max-w-2xl bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Student</h1>

      <p className="text-stone-600">
        Form UI created successfully. We’ll connect update functionality in the next step.
      </p>
    </div>
  )
}