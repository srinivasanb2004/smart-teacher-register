type WelcomeHeaderProps = {
  teacherName?: string;
};

export default function WelcomeHeader({
  teacherName = "Teacher",
}: WelcomeHeaderProps) {
  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="paper-card overflow-hidden rounded-3xl border border-[var(--paper-dark)] bg-[#fbf6ea] p-8 lg:p-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm italic text-[var(--stone)]">
            Teacher Dashboard
          </p>

          <h2 className="display-font mt-1 text-4xl font-semibold text-[var(--ink)]">
            Welcome back, {teacherName} 👋
          </h2>

          <p className="mt-4 max-w-2xl text-[var(--stone)]">
            Here is the live overview of your school register for today.
          </p>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--stone)]">
            Today
          </p>

          <p className="mt-1 text-lg font-semibold text-[var(--ink)]">
            {formattedDate}
          </p>
        </div>
      </div>
    </section>
  );
}