import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../../lib/prisma"
import { getCurrentTeacher } from "../../../../lib/auth"

export default async function SectionDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const { id } = await params

  const section = await prisma.section.findFirst({
    where: { id: Number(id), teacherId: teacher.teacherId },
    include: { students: true },
  })

  if (!section) {
    return <div className="p-6">Section not found</div>
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{section.name}</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-3">Roll No</th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {section.students.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-3">{student.rollNo}</td>
                <td className="p-3">{student.name}</td>
                <td className="p-3">
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}