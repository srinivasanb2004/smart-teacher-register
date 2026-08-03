"use client"

import { useEffect, useState } from "react"

type SchoolClass = {
  id: number
  name: string
}

type Section = {
  id: number
  name: string
  class: SchoolClass
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [name, setName] = useState("")
  const [classId, setClassId] = useState("")

  async function loadData() {
    const sectionRes = await fetch("/api/sections")
    const sectionData = await sectionRes.json()
    setSections(sectionData)

    const classRes = await fetch("/api/classes")
    const classData = await classRes.json()
    setClasses(classData)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function addSection() {
    if (!name || !classId) return

    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        classId,
      }),
    })

    setName("")
    setClassId("")
    loadData()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Sections</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="A"
            className="border rounded-xl px-4 py-3"
          />

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="border rounded-xl px-4 py-3"
          >
            <option value="">Select Class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                Class {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={addSection}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            Add Section
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Class</th>
              <th className="text-left p-4">Section</th>
            </tr>
          </thead>

          <tbody>
            {sections.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4 font-medium">Class {item.class.name}</td>
                <td className="p-4">Section {item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}