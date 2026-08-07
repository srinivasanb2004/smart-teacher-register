export default function PaperCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`paper-card rounded-2xl border border-[var(--paper-dark)] bg-[#fffdf8] p-5 ${className}`}
    >
      {children}
    </div>
  );
}