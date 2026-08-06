"use client"

import { useRouter, useSearchParams } from "next/navigation"

type Exam = {
  id: number
  name: string
}

export default function ExamFilter({
  exams,
  studentId,
}: {
  exams: Exam[]
  studentId: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const examId = searchParams.get("examId") || ""

  function handleChange(value: string) {
    if (value) {
      router.push(`/dashboard/students/${studentId}/marks?examId=${value}`)
    } else {
      router.push(`/dashboard/students/${studentId}/marks`)
    }
  }

  return (
    <select
      value={examId}
      onChange={(e) => handleChange(e.target.value)}
      className="border rounded-xl px-4 py-3 bg-white"
    >
      <option value="">All Exams</option>
      {exams.map((exam) => (
        <option key={exam.id} value={exam.id}>
          {exam.name}
        </option>
      ))}
    </select>
  )
}
