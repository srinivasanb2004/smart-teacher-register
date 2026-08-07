"use client"

import { useEffect, useMemo, useState } from "react"

type AcademicYear = { id: number; name: string }
type SchoolClass = { id: number; name: string; yearId: number }
type Section = { id: number; name: string; classId: number }
type Student = { id: number; name: string; rollNo: string }

export default function AttendancePage() {
    const [years, setYears] = useState<AcademicYear[]>([])
    const [classes, setClasses] = useState<SchoolClass[]>([])
    const [sections, setSections] = useState<Section[]>([])
    const [students, setStudents] = useState<Student[]>([])

    const [yearId, setYearId] = useState("")
    const [classId, setClassId] = useState("")
    const [sectionId, setSectionId] = useState("")
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    )

    const [attendance, setAttendance] = useState<Record<number, string>>({})

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
                initial[s.id] = "Present"
            })

            setAttendance(initial)
        }

        loadStudents()
    }, [sectionId])

    async function saveAttendance() {
        const records = students.map((s) => ({
            studentId: s.id,
            status: attendance[s.id] || "Present",
        }))

        await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date,
                records,
            }),
        })

        alert("Attendance saved successfully")
    }

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border shadow-sm p-6">
                <h1 className="text-2xl font-bold mb-4">Take Attendance</h1>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                        value={yearId}
                        onChange={(e) => {
                            setYearId(e.target.value)
                            setClassId("")
                            setSectionId("")
                        }}
                        className="border rounded-xl px-4 py-3"
                    >
                        <option value="">Academic Year</option>
                        {years.map((y) => (
                            <option key={y.id} value={y.id}>
                                {y.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={classId}
                        onChange={(e) => {
                            setClassId(e.target.value)
                            setSectionId("")
                        }}
                        className="border rounded-xl px-4 py-3"
                    >
                        <option value="">Class</option>
                        {filteredClasses.map((c) => (
                            <option key={c.id} value={c.id}>
                                Class {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={sectionId}
                        onChange={(e) => setSectionId(e.target.value)}
                        className="border rounded-xl px-4 py-3"
                    >
                        <option value="">Section</option>
                        {filteredSections.map((s) => (
                            <option key={s.id} value={s.id}>
                                Section {s.name}
                            </option>
                        ))}
                    </select>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded-xl px-4 py-3"
                    />
                </div>
            </div>

            {students.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white border rounded-2xl p-5">
                        <p className="text-sm text-stone-500">Total Students</p>
                        <p className="text-2xl font-bold mt-2">{students.length}</p>
                    </div>

                    <div className="bg-white border rounded-2xl p-5">
                        <p className="text-sm text-stone-500">Present</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            {
                                Object.values(attendance).filter((s) => s === "Present").length
                            }
                        </p>
                    </div>

                    <div className="bg-white border rounded-2xl p-5">
                        <p className="text-sm text-stone-500">Absent</p>
                        <p className="text-2xl font-bold text-red-600 mt-2">
                            {
                                Object.values(attendance).filter((s) => s === "Absent").length
                            }
                        </p>
                    </div>
                </div>
            )}

            {students.length > 0 && (
                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-6 border-b flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Student Attendance
                            </h2>
                            <p className="text-sm text-stone-500 mt-1">
                                Mark attendance for the selected section
                            </p>
                        </div>

                        <button
                            onClick={saveAttendance}
                            className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700"
                        >
                            Save Attendance
                        </button>
                    </div>

                    <table className="w-full">
                        <thead className="bg-stone-100">
                            <tr>
                                <th className="text-left p-4">Roll No</th>
                                <th className="text-left p-4">Student Name</th>
                                <th className="text-left p-4">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => (
                                <tr key={student.id} className="border-t">
                                    <td className="p-4">{student.rollNo}</td>
                                    <td className="p-4 font-medium">{student.name}</td>
                                    <td className="p-4">
                                        <select
                                            value={attendance[student.id] || "Present"}
                                            onChange={(e) =>
                                                setAttendance({
                                                    ...attendance,
                                                    [student.id]: e.target.value,
                                                })
                                            }
                                            className="border rounded-xl px-3 py-2"
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                        </select>
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