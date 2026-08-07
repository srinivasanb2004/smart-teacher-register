"use client";

import { useEffect, useState } from "react";
import DeleteRowButton from "../../../components/DeleteRowButton";
import PaperCard from "@/components/ui/paper-card";

type SchoolClass = {
  id: number;
  name: string;
};

type Section = {
  id: number;
  name: string;
  class: SchoolClass;
};

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");

  async function loadData() {
    const sectionRes = await fetch("/api/sections");
    const sectionData = await sectionRes.json();
    setSections(sectionData);

    const classRes = await fetch("/api/classes");
    const classData = await classRes.json();
    setClasses(classData);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function addSection() {
    if (!name || !classId) return;

    await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        classId,
      }),
    });

    setName("");
    setClassId("");
    loadData();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm italic text-[var(--stone)]">
          Academic Structure
        </p>
        <h1 className="display-font text-4xl font-semibold text-[var(--ink)]">
          Sections
        </h1>
      </div>

      <PaperCard className="bg-[#fbf6ea]">
        <div className="flex items-center justify-between">
          <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
            Create Section
          </h2>

          <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-sm text-[var(--stone)]">
            {sections.length} total sections
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="A"
            className="rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
          />

          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="rounded-xl border border-[var(--paper-dark)] bg-white px-4 py-3 outline-none focus:border-[var(--teal)] focus:ring-2 focus:ring-[var(--teal)]/10"
          >
            <option value="">Select Class</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                Class {item.name}
              </option>
            ))}
          </select>

          <button
            onClick={addSection}
            className="rounded-xl px-5 py-3 font-medium teal-btn transition"
          >
            Add Section
          </button>
        </div>
      </PaperCard>

      <PaperCard className="overflow-hidden p-0">
        <div className="border-b border-[var(--paper-dark)] bg-[#f3ead3] px-6 py-4">
          <h2 className="display-font text-2xl font-semibold text-[var(--ink)]">
            Existing Sections
          </h2>
        </div>

        {sections.length === 0 ? (
          <div className="p-8 text-center text-[var(--stone)]">
            No sections created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="border-b border-[var(--paper-dark)] bg-[#faf6ea]">
                <tr className="text-left text-sm text-[var(--stone)]">
                  <th className="p-4 font-medium">Class</th>
                  <th className="p-4 font-medium">Section</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--paper-dark)] bg-white">
                {sections.map((item) => (
                  <tr key={item.id} className="hover:bg-[#fffaf0]">
                    <td className="p-4 font-medium text-[var(--ink)]">
                      Class {item.class.name}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-[var(--paper)] px-3 py-1 text-sm font-medium text-[var(--ink)]">
                        Section {item.name}
                      </span>
                    </td>

                    <td className="p-4">
                      <DeleteRowButton
                        url={`/api/sections/${item.id}`}
                        confirmMessage={`Delete Section ${item.name} of Class ${item.class.name}? This will also delete all students in it, and their attendance, marks and fees. This cannot be undone.`}
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