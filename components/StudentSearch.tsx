"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

type Student = {
  id: number
  name: string
  admissionNo: string
  rollNo: string
  class: { name: string }
  section: { name: string }
}

export default function StudentSearch() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [students, setStudents] = useState<Student[]>([])
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  async function ensureLoaded() {
    if (loaded) return
    try {
      const data = await fetch("/api/students").then((r) => r.json())
      setStudents(Array.isArray(data) ? data : [])
    } catch {
      setStudents([])
    }
    setLoaded(true)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const q = query.trim().toLowerCase()

  const results = q
    ? students
        .filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.admissionNo.toLowerCase().includes(q) ||
            s.rollNo.toLowerCase().includes(q)
        )
        .slice(0, 8)
    : []

  function goToStudent(id: number) {
    setQuery("")
    setOpen(false)
    router.push(`/dashboard/students/${id}`)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-3 bg-white border border-stone-200 shadow-sm rounded-xl px-4 py-2">
        <Search size={18} className="text-stone-400 shrink-0" />
        <input
          type="text"
          value={query}
          onFocus={() => {
            ensureLoaded()
            setOpen(true)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            ensureLoaded()
            setOpen(true)
          }}
          placeholder="Search students by name, roll no, admission no..."
          className="bg-transparent outline-none text-sm w-full text-stone-700 placeholder:text-stone-400"
        />
      </div>

      {open && q && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-lg max-h-80 overflow-y-auto z-30">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-stone-500">
              No students match "{query}"
            </div>
          ) : (
            results.map((s) => (
              <button
                key={s.id}
                onClick={() => goToStudent(s.id)}
                className="w-full text-left px-4 py-3 hover:bg-stone-50 border-b last:border-b-0"
              >
                <p className="font-medium text-stone-800">{s.name}</p>
                <p className="text-xs text-stone-500">
                  Roll No {s.rollNo} • Class {s.class.name}-{s.section.name}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
