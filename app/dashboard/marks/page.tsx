"use client"

import { useEffect, useMemo, useState } from "react"

type AcademicYear = { id: number; name: string }
type SchoolClass = { id: number; name: string; yearId: number }
type Section = { id: number; name: string; classId: number }
type Student = { id: number; name: string; rollNo: string }
type Exam = { id: number; name: string }

const subjects = [
  "Tamil",
  "English",
  "Mathematics",
  "Science",
  "Social Science",
]

export default function MarksPage() {
  const [years, setYears] = useState<AcademicYear[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [exams, setExams] = useState<Exam[]>([])

  const [newExam, setNewExam] = useState("")

  const [yearId, setYearId] = useState("")
  const [classId, setClassId] = useState("")
  const [sectionId, setSectionId] = useState("")
  const [examId, setExamId] = useState("")
  const [subject, setSubject] = useState(subjects[0])

  const [marks, setMarks] = useState<Record<number, string>>({})

  useEffect(() => {
    async function load() {
      const y = await fetch("/api/academic-years").then((r) => r.json())
      const c = await fetch("/api/classes").then((r) => r.json())
      const s = await fetch("/api/sections").then((r) => r.json())
      const e = await fetch("/api/exams").then((r) => r.json())

      setYears(y)
      setClasses(c)
      setSections(s)
      setExams(e)
    }

    load()
  }, [])

  const filteredClasses = useMemo(
    () => classes.filter((c) => String(c.yearId) === yearId),
    [classes, yearId]
  )

  const filteredSections = useMemo(
    () => sections.filter((s) => String(s.classId) === classId),
    [sections, classId]
  )

  useEffect(() => {
    async function loadStudents() {
      if (!sectionId) return

      const data = await fetch("/api/students").then((r) => r.json())

      const filtered = data.filter(
        (s: any) => String(s.sectionId) === sectionId
      )

      setStudents(filtered)

      const initial: Record<number, string> = {}

      filtered.forEach((s: Student) => {
        initial[s.id] = ""
      })

      setMarks(initial)
    }

    loadStudents()
  }, [sectionId])

  async function createExam() {
    if (!newExam) return

    await fetch("/api/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newExam }),
    })

    setNewExam("")

    const e = await fetch("/api/exams").then((r) => r.json())
    setExams(e)
  }

  async function saveMarks() {
    if (!examId || !subject) {
      alert("Select exam and subject")
      return
    }

    const records = students.map((s) => ({
      studentId: s.id,
      marks: marks[s.id] || 0,
    }))

    await fetch("/api/marks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId,
        subject,
        records,
      }),
    })

    alert("Marks saved successfully")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold">Bulk Marks Entry</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={newExam}
            onChange={(e) => setNewExam(e.target.value)}
            placeholder="Quarterly Exam"
            className="flex-1 min-w-0 border rounded-xl px-4 py-3"
          />

          <button
            onClick={createExam}
            className="w-full sm:w-auto shrink-0 bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700"
          >
            Create Exam
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select value={yearId} onChange={(e)=>{setYearId(e.target.value);setClassId("");setSectionId("")}} className="border rounded-xl px-4 py-3">
            <option value="">Academic Year</option>
            {years.map((y)=>(
              <option key={y.id} value={y.id}>{y.name}</option>
            ))}
          </select>

          <select value={classId} onChange={(e)=>{setClassId(e.target.value);setSectionId("")}} className="border rounded-xl px-4 py-3">
            <option value="">Class</option>
            {filteredClasses.map((c)=>(
              <option key={c.id} value={c.id}>Class {c.name}</option>
            ))}
          </select>

          <select value={sectionId} onChange={(e)=>setSectionId(e.target.value)} className="border rounded-xl px-4 py-3">
            <option value="">Section</option>
            {filteredSections.map((s)=>(
              <option key={s.id} value={s.id}>Section {s.name}</option>
            ))}
          </select>

          <select value={examId} onChange={(e)=>setExamId(e.target.value)} className="border rounded-xl px-4 py-3">
            <option value="">Exam</option>
            {exams.map((e)=>(
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>

          <select value={subject} onChange={(e)=>setSubject(e.target.value)} className="border rounded-xl px-4 py-3">
            {subjects.map((s)=>(
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Enter Marks
              </h2>
              <p className="text-sm text-stone-500 mt-1">
                Subject: {subject}
              </p>
            </div>

            <button
              onClick={saveMarks}
              className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700"
            >
              Save Marks
            </button>
          </div>

          <table className="w-full">
            <thead className="bg-stone-100">
              <tr>
                <th className="text-left p-4">Roll No</th>
                <th className="text-left p-4">Student Name</th>
                <th className="text-left p-4">Marks / 100</th>
              </tr>
            </thead>

            <tbody>
              {students.map((student)=>(
                <tr key={student.id} className="border-t">
                  <td className="p-4">{student.rollNo}</td>
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[student.id] || ""}
                      onChange={(e)=>
                        setMarks({
                          ...marks,
                          [student.id]: e.target.value,
                        })
                      }
                      className="border rounded-xl px-3 py-2 w-32"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}