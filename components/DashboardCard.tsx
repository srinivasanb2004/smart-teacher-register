export default function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ background: "white", borderRadius: 18, padding: 20, boxShadow: "0 10px 25px rgba(15,23,42,0.08)" }}>
      <div style={{ color: "#64748b", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10 }}>{value}</div>
    </div>
  )
}
