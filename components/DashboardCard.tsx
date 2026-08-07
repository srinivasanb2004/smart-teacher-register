export default function DashboardCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ background: "white", borderRadius: 18, padding: 20, boxShadow: "0 10px 25px rgba(35,41,31,0.08)", border: "1px solid #e7e2da" }}>
      <div style={{ color: "#78716c", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 34, fontWeight: 800, marginTop: 10, fontFamily: "var(--font-sora)" }}>{value}</div>
    </div>
  )
}
