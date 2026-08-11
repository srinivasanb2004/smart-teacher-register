"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

type AcademicYear = { id: number; name: string }
type SchoolClass = { id: number; name: string; yearId: number }
type Section = { id: number; name: string; classId: number }

export default function AddStudentPage() {
  const router = useRouter()

  const [years, setYears] = useState<AcademicYear[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [sections, setSections] = useState<Section[]>([])

  const [form, setForm] = useState({
    admissionNo: "",
    rollNo: "",
    name: "",
    gender: "Male",
    dob: "",
    parentName: "",
    parentPhone: "",
    address: "",
    yearId: "",
    classId: "",
    sectionId: "",
  })

  useEffect(() => {
    async function load() {
      const y = await fetch("/api/academic-years").then((r) => r.json())
      const c = await fetch("/api/classes").then((r) => r.json())
      const s = await fetch("/api/sections").then((r) => r.json())

      setYears(y)
      setClasses(c)
      setSections(s)
    }

    load()
  }, [])

  const filteredClasses = useMemo(
    () => classes.filter((c) => String(c.yearId) === form.yearId),
    [classes, form.yearId]
  )

  const filteredSections = useMemo(
    () => sections.filter((s) => String(s.classId) === form.classId),
    [sections, form.classId]
  )

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    router.push("/dashboard/students")
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6">Add Student</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Admission No" value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} className="border rounded-xl px-4 py-3" required />
          <input placeholder="Roll No" value={form.rollNo} onChange={(e) => setForm({ ...form, rollNo: e.target.value })} className="border rounded-xl px-4 py-3" required />
          <input placeholder="Student Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-xl px-4 py-3 md:col-span-2" required />

          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border rounded-xl px-4 py-3">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <div className="flex flex-col gap-2 w-full">
            <label className="block md:hidden text-sm font-medium text-gray-700">
              Date of Birth
            </label>

            <input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              className="w-full max-w-full box-border appearance-none border rounded-xl px-4 py-3 text-base min-h-[48px] bg-white" required
            />
          </div>


          <input placeholder="Parent Name" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} className="border rounded-xl px-4 py-3" required />
          <input placeholder="Parent Phone" value={form.parentPhone} onChange={(e) => setForm({ ...form, parentPhone: e.target.value })} className="border rounded-xl px-4 py-3" required />

          <textarea placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="border rounded-xl px-4 py-3 md:col-span-2" rows={3} required />

          <select value={form.yearId} onChange={(e) => setForm({ ...form, yearId: e.target.value, classId: "", sectionId: "" })} className="border rounded-xl px-4 py-3" required>
            <option value="">Select Academic Year</option>
            {years.map((y) => (
              <option key={y.id} value={y.id}>{y.name}</option>
            ))}
          </select>

          <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value, sectionId: "" })} className="border rounded-xl px-4 py-3" required>
            <option value="">Select Class</option>
            {filteredClasses.map((c) => (
              <option key={c.id} value={c.id}>Class {c.name}</option>
            ))}
          </select>

          <select value={form.sectionId} onChange={(e) => setForm({ ...form, sectionId: e.target.value })} className="border rounded-xl px-4 py-3 md:col-span-2" required>
            <option value="">Select Section</option>
            {filteredSections.map((s) => (
              <option key={s.id} value={s.id}>Section {s.name}</option>
            ))}
          </select>

          <button type="submit" className="bg-teal-600 text-white py-3 rounded-xl hover:bg-teal-700 md:col-span-2">
            Save Student
          </button>
        </form>
      </div >
    </div >
  )
}