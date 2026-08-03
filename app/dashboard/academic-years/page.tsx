"use client"

import { useEffect, useState } from "react"

export default function AcademicYearsPage() {
  const [years, setYears] = useState<any[]>([])
  const [name, setName] = useState("")

  async function loadYears() {
    const res = await fetch("/api/academic-years")
    const data = await res.json()
    setYears(data)
  }

  useEffect(() => {
    loadYears()
  }, [])

  async function addYear() {
    if (!name) return

    await fetch("/api/academic-years", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        isActive: false,
      }),
    })

    setName("")
    loadYears()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-2xl font-bold mb-4">Academic Years</h1>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2027-2028"
            className="flex-1 border rounded-xl px-4 py-3"
          />

          <button
            onClick={addYear}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            Add Year
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Academic Year</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {years.map((year) => (
              <tr key={year.id} className="border-t">
                <td className="p-4 font-medium">{year.name}</td>
                <td className="p-4">
                  <span
                    className={
                      year.isActive
                        ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                        : "bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm"
                    }
                  >
                    {year.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}