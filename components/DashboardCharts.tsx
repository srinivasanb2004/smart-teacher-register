"use client"

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

type Props = {
  totalStudents: number
  totalClasses: number
  paidFees: number
  pendingFees: number
  attendancePercentage: number
}

export default function DashboardCharts({
  totalStudents,
  totalClasses,
  paidFees,
  pendingFees,
  attendancePercentage,
}: Props) {
  const feeData = [
    { name: "Paid", value: paidFees },
    { name: "Pending", value: pendingFees },
  ]

  const attendanceData = [
    { name: "Present", value: attendancePercentage },
    { name: "Absent", value: 100 - attendancePercentage },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
        <div className="mb-3">
          <h3 className="font-semibold text-stone-800">Fee Collection</h3>
          <p className="text-sm text-stone-500">
            Paid vs pending fees
          </p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={feeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={45}
              paddingAngle={4}
            >
              <Cell fill="#16a34a" />
              <Cell fill="#d97706" />
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
        <div className="mb-3">
          <h3 className="font-semibold text-stone-800">Attendance</h3>
          <p className="text-sm text-stone-500">
            Present vs absent percentage
          </p>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={attendanceData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              innerRadius={45}
              paddingAngle={4}
            >
              <Cell fill="#2563eb" />
              <Cell fill="#e2e8f0" />
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="md:col-span-2 bg-stone-50 rounded-2xl p-4 border border-stone-200">
        <h3 className="font-semibold text-stone-800 mb-4">
          Quick Summary
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Students</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {totalStudents}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Classes</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {totalClasses}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Paid Fees</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {paidFees}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Attendance</p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {attendancePercentage}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}