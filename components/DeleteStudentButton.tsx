"use client"

export default function DeleteStudentButton({
  id,
}: {
  id: number
}) {
  async function handleDelete() {
    const ok = confirm("Delete this student?")

    if (!ok) return

    await fetch(`/api/students/${id}`, {
      method: "DELETE",
    })

    window.location.href = "/dashboard/sections"
  }

  return (
    <button
      onClick={handleDelete}
      className="ml-3 inline-block mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
    >
      Delete Student
    </button>
  )
}