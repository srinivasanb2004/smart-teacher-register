"use client"

import { useEffect, useState } from "react"
import DeleteRowButton from "../../../components/DeleteRowButton"

type AcademicYear = {
  id: number
  name: string
}

type SchoolClass = {
  id: number
  name: string
  year: AcademicYear
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [years, setYears] = useState<AcademicYear[]>([])
  const [name, setName] = useState("")
  const [yearId, setYearId] = useState("")

  async function loadData() {
    const classRes = await fetch("/api/classes")
    const classData = await classRes.json()
    setClasses(classData)

    const yearRes = await fetch("/api/academic-years")
    const yearData = await yearRes.json()
    setYears(yearData)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function addClass() {
    if (!name || !yearId) return

    await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        yearId,
      }),
    })

    setName("")
    setYearId("")
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Classes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="10"
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="">Select Academic Year</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>

          <button
            onClick={addClass}
            className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700"
          >
            Add Class
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-stone-100">
            <tr>
              <th className="text-left p-4">Class</th>
              <th className="text-left p-4">Academic Year</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">Class {item.name}</td>
                <td className="p-4">{item.year.name}</td>
                <td className="p-4">
                  <DeleteRowButton
                    url={`/api/classes/${item.id}`}
                    confirmMessage={`Delete Class ${item.name}? This will also delete all its sections and students, and their attendance, marks and fees. This cannot be undone.`}
                    onDeleted={loadData}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}