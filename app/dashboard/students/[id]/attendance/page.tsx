"use client"

import { useEffect, useState } from "react"

type Attendance = {
    id: number
    date: string
    status: string
}

export default function AttendancePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const [studentId, setStudentId] = useState<number | null>(null)
    const [date, setDate] = useState("")
    const [status, setStatus] = useState("Present")
    const [records, setRecords] = useState<Attendance[]>([])
    const [month, setMonth] = useState("")

    useEffect(() => {
        params.then((p) => setStudentId(Number(p.id)))
    }, [params])

    async function loadAttendance(id: number, selectedMonth?: string) {
        let url = `/api/students/${id}/attendance`

        if (selectedMonth) {
            url += `?month=${selectedMonth}`
        }

        const res = await fetch(url)
        const data = await res.json()
        setRecords(data)
    }

    useEffect(() => {
        if (studentId) {
            loadAttendance(studentId)
        }
    }, [studentId])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (!studentId) return

        const res = await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                studentId,
                date,
                status,
            }),
        })

        if (res.ok) {
            alert("Attendance saved")
            setDate("")
            loadAttendance(studentId, month)
        }
    }

    // Attendance summary
    const total = records.length
    const present = records.filter((r) => r.status === "Present").length
    const percentage = total ? Math.round((present / total) * 100) : 0

    return (
        <div className="space-y-6 p-6">
            {/* Add Attendance Form */}
            <div className="bg-white rounded-2xl shadow p-6">
                <h1 className="text-2xl font-bold mb-4">Add Attendance</h1>

                <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border rounded-lg p-3"
                        required
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg p-3"
                    >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>

                    <button className="bg-teal-600 text-white rounded-lg p-3 hover:bg-teal-700">
                        Save
                    </button>
                </form>
            </div>

            {/* Month Filter */}
            <div className="bg-white rounded-2xl shadow p-4">
                <label className="block text-sm font-medium mb-2">
                    Select Month
                </label>

                <input
                    type="month"
                    value={month}
                    onChange={(e) => {
                        const value = e.target.value
                        setMonth(value)

                        if (studentId) {
                            loadAttendance(studentId, value)
                        }
                    }}
                    className="border rounded-lg p-2"
                />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow text-center">
                    <p className="text-stone-500 text-sm">Total</p>
                    <p className="text-2xl font-bold">{total}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow text-center">
                    <p className="text-stone-500 text-sm">Present</p>
                    <p className="text-2xl font-bold text-green-600">{present}</p>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow text-center">
                    <p className="text-stone-500 text-sm">Attendance %</p>
                    <p className="text-2xl font-bold text-teal-600">{percentage}%</p>
                </div>
            </div>

            {/* Attendance Table */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Attendance Records</h2>
                </div>

                <table className="w-full">
                    <thead className="bg-stone-100">
                        <tr>
                            <th className="text-left p-3">Date</th>
                            <th className="text-left p-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((record) => (
                            <tr key={record.id} className="border-t">
                                <td className="p-3">
                                    {new Date(record.date).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <span
                                        className={
                                            record.status === "Present"
                                                ? "text-green-600 font-medium"
                                                : "text-red-600 font-medium"
                                        }
                                    >
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {records.length === 0 && (
                            <tr>
                                <td colSpan={2} className="p-6 text-center text-stone-500">
                                    No attendance records yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}