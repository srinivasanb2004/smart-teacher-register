"use client"

import toast from "react-hot-toast"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Search, Trash2, Eye, Plus } from "lucide-react"

type Student = {
  id: number
  name: string
  admissionNo: string
  class: { name: string }
  section: { name: string }
  parentPhone: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState("")
  const [classFilter, setClassFilter] = useState("all")
  const [sectionFilter, setSectionFilter] = useState("all")

  const [page, setPage] = useState(1)
  const pageSize = 10

  async function loadStudents() {
    const data = await fetch("/api/students").then((r) => r.json())
    setStudents(data)
  }

  useEffect(() => {
    loadStudents()
  }, [])

  const classes = useMemo(
    () => Array.from(new Set(students.map((s) => s.class.name))),
    [students]
  )

  const sections = useMemo(
    () => Array.from(new Set(students.map((s) => s.section.name))),
    [students]
  )

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(search.toLowerCase())

      const matchesClass =
        classFilter === "all" || s.class.name === classFilter

      const matchesSection =
        sectionFilter === "all" || s.section.name === sectionFilter

      return matchesSearch && matchesClass && matchesSection
    })
  }, [students, search, classFilter, sectionFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  async function deleteStudent(id: number, name: string) {
    const ok = confirm(`Delete ${name}? This action cannot be undone.`)
    if (!ok) return

    await fetch(`/api/students/${id}`, {
      method: "DELETE",
    })

    toast.success("Student deleted successfully")

    await loadStudents()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-800">
            Students
          </h1>
          <p className="text-stone-500 mt-1">
            Manage student records
          </p>
        </div>

        <Link
          href="/dashboard/students/new"
          className="inline-flex items-center gap-2 bg-teal-600 text-white px-4 py-3 rounded-xl hover:bg-teal-700 shadow-sm"
        >
          <Plus size={18} />
          Add Student
        </Link>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or admission no"
              className="w-full border rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value)}
            className="border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-stone-800">
            Student List
          </h2>

          <span className="text-sm text-stone-500">
            {filtered.length} student(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-stone-700">
                  Name
                </th>
                <th className="text-left p-4 text-sm font-semibold text-stone-700">
                  Admission No
                </th>
                <th className="text-left p-4 text-sm font-semibold text-stone-700">
                  Class
                </th>
                <th className="text-left p-4 text-sm font-semibold text-stone-700">
                  Section
                </th>
                <th className="text-left p-4 text-sm font-semibold text-stone-700">
                  Parent Phone
                </th>
                <th className="text-right p-4 text-sm font-semibold text-stone-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((student) => (
                <tr key={student.id} className="border-t hover:bg-stone-50">
                  <td className="p-4 font-medium text-stone-800">
                    {student.name}
                  </td>

                  <td className="p-4 text-stone-600">
                    {student.admissionNo}
                  </td>

                  <td className="p-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
                      {student.class.name}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                      {student.section.name}
                    </span>
                  </td>

                  <td className="p-4 text-stone-600">
                    {student.parentPhone}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/dashboard/students/${student.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border text-stone-700 hover:bg-stone-100"
                      >
                        <Eye size={16} />
                        View
                      </Link>

                      <button
                        onClick={() =>
                          deleteStudent(student.id, student.name)
                        }
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-10 text-center text-stone-500"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t bg-stone-50">
          <p className="text-sm text-stone-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-2 rounded-lg border disabled:opacity-50"
            >
              Previous
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-2 rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}