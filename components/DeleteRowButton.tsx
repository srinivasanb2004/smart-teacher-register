"use client"

export default function DeleteRowButton({
  url,
  confirmMessage,
  onDeleted,
}: {
  url: string
  confirmMessage: string
  onDeleted: () => void
}) {
  async function handleDelete() {
    const ok = confirm(confirmMessage)
    if (!ok) return

    const res = await fetch(url, { method: "DELETE" })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      alert(data.error || "Something went wrong while deleting")
      return
    }

    onDeleted()
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-700 hover:underline text-sm font-medium"
    >
      Delete
    </button>
  )
}
