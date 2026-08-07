"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function SettingsPage() {
    const [schoolName, setSchoolName] = useState("")
    const [teacherName, setTeacherName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    // Load settings when page opens
    async function loadSettings() {
        const res = await fetch("/api/settings", {
            cache: "no-store",
        })

        const data = await res.json()

        if (data) {
            setSchoolName(data.schoolName || "")
            setTeacherName(data.teacherName || "")
            setEmail(data.email || "")
        }
    }

    useEffect(() => {
        loadSettings()
    }, [])

    async function saveSettings() {
        setLoading(true)

        const res = await fetch("/api/settings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                schoolName,
                teacherName,
                email,
            }),
        })

        setLoading(false)

        if (res.ok) {
            // Save to localStorage for dashboard header
            localStorage.setItem(
                "schoolSettings",
                JSON.stringify({
                    schoolName,
                    teacherName,
                    teacherEmail: email,
                })
            )

            toast.success("Settings saved successfully")

            // Reload latest values from database
            await loadSettings()
        }
    }

    return (
        <div className="max-w-3xl space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
                <p className="text-stone-500 mt-1">
                    School and teacher profile settings
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
                <div>
                    <label className="text-sm font-medium text-stone-700">
                        School Name
                    </label>

                    <input
                        autoComplete="off"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        className="mt-2 w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter school name"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-stone-700">
                        Teacher Name
                    </label>

                    <input
                        autoComplete="off"
                        value={teacherName}
                        onChange={(e) => setTeacherName(e.target.value)}
                        className="mt-2 w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter teacher name"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-stone-700">
                        Email
                    </label>

                    <input
                        autoComplete="off"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full border border-stone-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Enter email address"
                    />
                </div>

                <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="bg-teal-600 text-white px-5 py-3 rounded-xl hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                    {loading ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    )
}