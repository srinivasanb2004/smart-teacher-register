"use client"

import Link from "next/link"

import { useEffect, useMemo, useState } from "react"

type Fee = {
  id: number
  term: string
  amount: number
  status: string
  paymentDate: string | null
}

type Student = {
  id: number
  name: string
  admissionNo: string
  class: { name: string }
  section: { name: string }
  fees: Fee[]
}

const TERMS = ["Term 1", "Term 2", "Term 3"]

export default function StudentFeesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [student, setStudent] = useState<Student | null>(null)
  const [studentId, setStudentId] = useState<string>("")
  const [amounts, setAmounts] = useState<Record<string, string>>({})
  const [savingTerm, setSavingTerm] = useState<string | null>(null)

  async function loadStudent(id: string) {
    const data = await fetch("/api/students").then((r) => r.json())
    const found = data.find((s: any) => String(s.id) === id) || null
    setStudent(found)

    const nextAmounts: Record<string, string> = {}
    TERMS.forEach((term) => {
      const existing = found?.fees.find((f: Fee) => f.term === term)
      nextAmounts[term] = existing ? String(existing.amount) : ""
    })
    setAmounts(nextAmounts)
  }

  useEffect(() => {
    async function init() {
      const { id } = await params
      setStudentId(id)
      await loadStudent(id)
    }

    init()
  }, [params])

  async function saveAmount(term: string) {
    const amount = Number(amounts[term])

    if (!amount || amount <= 0) {
      alert("Enter a valid fee amount")
      return
    }

    setSavingTerm(term)

    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, term, amount }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || "Could not save the fee amount")
      setSavingTerm(null)
      return
    }

    await loadStudent(studentId)
    setSavingTerm(null)
  }

  async function updateStatus(feeId: number, status: string) {
    await fetch(`/api/fees/${feeId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    await loadStudent(studentId)
  }

  const summary = useMemo(() => {
    if (!student) {
      return { set: 0, paid: 0, pending: 0, paidAmount: 0, pendingAmount: 0 }
    }

    const paidFees = student.fees.filter((f) => f.status === "Paid")
    const pendingFees = student.fees.filter((f) => f.status === "Pending")

    return {
      set: student.fees.length,
      paid: paidFees.length,
      pending: pendingFees.length,
      paidAmount: paidFees.reduce((s, f) => s + f.amount, 0),
      pendingAmount: pendingFees.reduce((s, f) => s + f.amount, 0),
    }
  }, [student])

  if (!student) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Fee Ledger</h1>

            <p className="text-slate-500 mt-1">
              {student.name} • {student.admissionNo}
            </p>

            <p className="text-sm text-slate-500 mt-1">
              Class {student.class.name} - {student.section.name}
            </p>
          </div>

          <Link
            href="/dashboard/fees"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl border"
          >
            ← Back to Fees Dashboard
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">Terms Set</p>
          <p className="text-2xl font-bold mt-2">
            {summary.set} / {TERMS.length}
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm text-green-700">Paid Terms</p>
          <p className="text-2xl font-bold text-green-800 mt-2">
            {summary.paid}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-700">Pending Terms</p>
          <p className="text-2xl font-bold text-red-800 mt-2">
            {summary.pending}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm text-blue-700">Pending Amount</p>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            ₹{summary.pendingAmount}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Term-wise Fees</h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter the fee amount for each term, then mark it as paid once it's
            collected.
          </p>
        </div>

        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Term</th>
              <th className="text-left p-4">Amount (₹)</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Payment Date</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {TERMS.map((term) => {
              const fee = student.fees.find((f) => f.term === term)

              return (
                <tr key={term} className="border-t">
                  <td className="p-4 font-medium">{term}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        placeholder="Enter amount"
                        value={amounts[term] ?? ""}
                        onChange={(e) =>
                          setAmounts({ ...amounts, [term]: e.target.value })
                        }
                        className="border rounded-lg px-3 py-2 w-32"
                      />
                      <button
                        onClick={() => saveAmount(term)}
                        disabled={savingTerm === term}
                        className="text-sm bg-slate-800 text-white px-3 py-2 rounded-lg hover:bg-slate-900 disabled:opacity-50"
                      >
                        {fee ? "Update" : "Save"}
                      </button>
                    </div>
                  </td>

                  <td className="p-4">
                    {fee ? (
                      <span
                        className={
                          fee.status === "Paid"
                            ? "bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                            : "bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {fee.status}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-sm">Not set</span>
                    )}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {fee?.paymentDate
                      ? new Date(fee.paymentDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-4">
                    {!fee ? (
                      <span className="text-slate-400 text-sm">
                        Save amount first
                      </span>
                    ) : fee.status === "Pending" ? (
                      <button
                        onClick={() => updateStatus(fee.id, "Paid")}
                        className="bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 text-sm"
                      >
                        Mark Paid
                      </button>
                    ) : (
                      <button
                        onClick={() => updateStatus(fee.id, "Pending")}
                        className="bg-slate-600 text-white px-3 py-2 rounded-xl hover:bg-slate-700 text-sm"
                      >
                        Mark Pending
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold">Receipt Preview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Print-ready summary for paid fees
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><span className="font-medium">Student:</span> {student.name}</p>
            <p><span className="font-medium">Admission No:</span> {student.admissionNo}</p>
            <p><span className="font-medium">Class:</span> {student.class.name}</p>
          </div>

          <div>
            <p><span className="font-medium">Section:</span> {student.section.name}</p>
            <p><span className="font-medium">Paid Terms:</span> {summary.paid}</p>
            <p><span className="font-medium">Paid Amount:</span> ₹{summary.paidAmount}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}
