import Link from "next/link"
import { redirect } from "next/navigation"
import { prisma } from "../../../lib/prisma"
import { getCurrentTeacher } from "../../../lib/auth"

export default async function FeesDashboardPage() {
  const teacher = await getCurrentTeacher()
  if (!teacher) redirect("/login")

  const fees = await prisma.fee.findMany({
    where: { teacherId: teacher.teacherId },
    include: {
      student: {
        include: {
          class: true,
          section: true,
        },
      },
    },
  })

  const totalAmount = fees.reduce((s: number, f: any) => s + f.amount, 0)

  const paidFees = fees.filter((f: any) => f.status === "Paid")
  const pendingFees = fees.filter((f: any) => f.status === "Pending")

  const paidAmount = paidFees.reduce(
    (s: number, f: any) => s + f.amount,
    0
  )

  const pendingAmount = pendingFees.reduce(
    (s: number, f: any) => s + f.amount,
    0
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fees Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Overall fee collection summary
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Fees</p>
          <p className="text-2xl font-bold mt-2">₹{totalAmount}</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p className="text-sm text-green-700">Collected</p>
          <p className="text-2xl font-bold text-green-800 mt-2">
            ₹{paidAmount}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p className="text-sm text-red-700">Pending</p>
          <p className="text-2xl font-bold text-red-800 mt-2">
            ₹{pendingAmount}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <p className="text-sm text-blue-700">Collection %</p>
          <p className="text-2xl font-bold text-blue-800 mt-2">
            {totalAmount
              ? Math.round((paidAmount / totalAmount) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Pending Fees</h2>
        </div>

        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Student</th>
              <th className="text-left p-4">Class</th>
              <th className="text-left p-4">Month</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {pendingFees.map((fee: any) => (
              <tr key={fee.id} className="border-t">
                <td className="p-4 font-medium">
                  {fee.student.name}
                </td>

                <td className="p-4">
                  {fee.student.class.name}-{fee.student.section.name}
                </td>

                <td className="p-4">{fee.month}</td>

                <td className="p-4">₹{fee.amount}</td>

                <td className="p-4">
                  <Link
                    href={`/dashboard/students/${fee.student.id}/fees`}
                    className="text-blue-600 hover:underline"
                  >
                    Open Ledger
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}