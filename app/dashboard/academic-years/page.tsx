"use client";

import { useEffect, useState } from "react";
import PaperCard from "@/components/ui/paper-card";

type AcademicYear = {
  id: number;
  name: string;
};

export default function AcademicYearsPage() {
  const [name, setName] = useState("");
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadYears() {
    try {
      const res = await fetch("/api/academic-years");
      const data = await res.json();
      setYears(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadYears();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/academic-years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName("");
        loadYears();
      } else {
        alert("Failed to create academic year");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm italic text-[var(--stone)]">
          Academic Management
        </p>
        <h1 className="display-font text-4xl font-semibold text-[var(--ink)]">
          Academic Years
        </h1>
      </div>

      <PaperCard className="max-w-2xl bg-[#fbf6ea]">
        <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
          Create Academic Year
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2026 - 2027"
            className="flex-1 rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 outline-none focus:border-[var(--teal)]"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl px-5 py-3 font-medium teal-btn disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Year"}
          </button>
        </form>
      </PaperCard>

      <PaperCard>
        <div className="flex items-center justify-between">
          <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
            Existing Academic Years
          </h2>
          <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-sm text-[var(--stone)]">
            {years.length} total
          </span>
        </div>

        {years.length === 0 ? (
          <p className="mt-6 text-[var(--stone)]">
            No academic years created yet.
          </p>
        ) : (
          <div className="mt-6 space-y-3">
            {years.map((year) => (
              <div
                key={year.id}
                className="flex items-center justify-between rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-[var(--ink)]">{year.name}</p>
                  <p className="text-sm text-[var(--stone)]">
                    Academic Year
                  </p>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        )}
      </PaperCard>
    </div>
  );
}