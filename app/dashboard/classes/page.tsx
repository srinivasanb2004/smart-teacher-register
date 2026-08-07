"use client";

import { useEffect, useState } from "react";
import DeleteRowButton from "../../../components/DeleteRowButton";
import PaperCard from "@/components/ui/paper-card";

type AcademicYear = {
  id: number;
  name: string;
};

type SchoolClass = {
  id: number;
  name: string;
  year: AcademicYear;
};

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [name, setName] = useState("");
  const [yearId, setYearId] = useState("");

  async function loadData() {
    const classRes = await fetch("/api/classes");
    const classData = await classRes.json();
    setClasses(classData);

    const yearRes = await fetch("/api/academic-years");
    const yearData = await yearRes.json();
    setYears(yearData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addClass() {
    if (!name || !yearId) return;

    await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        yearId,
      }),
    });

    setName("");
    setYearId("");
    loadData();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm italic text-[var(--stone)]">
          Academic Structure
        </p>
        <h1 className="display-font text-4xl font-semibold text-[var(--ink)]">
          Classes
        </h1>
      </div>

      <PaperCard className="bg-[#fbf6ea]">
        <div className="flex items-center justify-between">
          <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
            Create Class
          </h2>

          <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-sm text-[var(--stone)]">
            {classes.length} total classes
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="10"
            className="rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
          />

          <select
            value={yearId}
            onChange={(e) => setYearId(e.target.value)}
            className="rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
          >
            <option value="">Select Academic Year</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>

          <button
            onClick={addClass}
            className="rounded-xl px-5 py-3 font-medium teal-btn transition"
          >
            Add Class
          </button>
        </div>
      </PaperCard>

      <PaperCard className="overflow-hidden p-0">
        <div className="border-b border-[var(--paper-dark)] bg-[#f3ead3] px-6 py-4">
          <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
            Existing Classes
          </h2>
        </div>

        {classes.length === 0 ? (
          <div className="p-8 text-center text-[var(--stone)]">
            No classes created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="border-b border-[var(--paper-dark)] bg-[#faf6ea]">
                <tr className="text-left text-sm text-[var(--stone)]">
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Academic Year</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--paper-dark)] bg-white">
                {classes.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fffaf0]">
                    <td className="p-4 font-medium text-[var(--ink)]">
                      Class {item.name}
                    </td>

                    <td className="p-4 text-[var(--ink)]">
                      <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-sm">
                        {item.year.name}
                      </span>
                    </td>

                    <td className="p-4">
                      <DeleteRowButton
                        url={`/api/classes/${item.id}`}
                        confirmMessage={`Delete Class ${item.name}? This will also delete all its sections and students, and their attendance, marks and fees. This cannot be undone.`}
                        onDeleted={loadData}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PaperCard>
    </div>
  );
}