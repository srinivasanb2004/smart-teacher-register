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
    <div
      ref={containerRef}
      className="relative w-full rounded-xl border border-stone-200 bg-white px-3 py-2 shadow-sm md:rounded-2xl md:px-4 md:py-3"
    >
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-stone-400 md:h-5 md:w-5" />

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
          placeholder="Search students..."
          className="w-full bg-transparent text-xs text-stone-700 outline-none placeholder:text-stone-400 md:text-sm"
        />
      </div>

      {open && q && (
        <div className="absolute left-0 right-0 z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-stone-200 bg-white shadow-lg">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-stone-500">
              No students match "{query}"
            </div>
          ) : (
            results.map((s) => (
              <button
                key={s.id}
                onClick={() => goToStudent(s.id)}
                className="w-full border-b px-4 py-3 text-left hover:bg-stone-50 last:border-b-0"
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
