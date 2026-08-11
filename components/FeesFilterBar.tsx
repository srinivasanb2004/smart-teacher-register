"use client"

import { useRouter, useSearchParams } from "next/navigation"

type SchoolClass = { id: number; name: string }
type Section = { id: number; name: string; classId: number }

const TERMS = ["Term 1", "Term 2", "Term 3"]

export default function FeesFilterBar({
  classes,
  sections,
}: {
  classes: SchoolClass[]
  sections: Section[]
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const classId = searchParams.get("classId") || ""
  const sectionId = searchParams.get("sectionId") || ""
  const term = searchParams.get("term") || ""

  const filteredSections = sections.filter(
    (s) => !classId || String(s.classId) === classId
  )

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Changing the class invalidates whichever section was selected
    if (key === "classId") {
      params.delete("sectionId")
    }

    router.push(`/dashboard/fees?${params.toString()}`)
  }

  const hasFilters = classId || sectionId || term

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
      <select
        value={classId}
        onChange={(e) => update("classId", e.target.value)}
        className="border rounded-xl px-4 py-3"
      >
        <option value="">All Classes</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>
            Class {c.name}
          </option>
        ))}
      </select>

      <select
        value={sectionId}
        onChange={(e) => update("sectionId", e.target.value)}
        className="border rounded-xl px-4 py-3"
      >
        <option value="">All Sections</option>
        {filteredSections.map((s) => (
          <option key={s.id} value={s.id}>
            Section {s.name}
          </option>
        ))}
      </select>

      <select
        value={term}
        onChange={(e) => update("term", e.target.value)}
        className="border rounded-xl px-4 py-3"
      >
        <option value="" disabled>
          Term
        </option>

        {TERMS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {hasFilters ? (
        <button
          onClick={() => router.push("/dashboard/fees")}
          className="border rounded-xl px-4 py-3 text-stone-600 hover:bg-stone-50"
        >
          Clear Filters
        </button>
      ) : (
        <div />
      )}
    </div>
  )
}
