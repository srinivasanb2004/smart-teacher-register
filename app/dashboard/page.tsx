import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getCurrentTeacher } from "../../lib/auth";
import PaperCard from "@/components/ui/paper-card";
import WelcomeHeader from "../../components/WelcomeHeader";

import {
  Users,
  CalendarCheck2,
  IndianRupee,
  ClipboardList,
} from "lucide-react";

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default async function DashboardPage() {
  const teacher = await getCurrentTeacher();

  if (!teacher) redirect("/login");

  const teacherId = teacher.teacherId;

  const settings = await prisma.appSettings.findUnique({
    where: { teacherId },
    select: { teacherName: true },
  });

  const teacherName = settings?.teacherName || "Teacher";

  const today = new Date();

  const monthName = today.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  ).getDay();

  const calendarDays = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const totalStudents = await prisma.student.count({ where: { teacherId } });
  const totalClasses = await prisma.schoolClass.count({ where: { teacherId } });
  const totalSections = await prisma.section.count({ where: { teacherId } });
  const paidFees = await prisma.fee.count({ where: { teacherId, status: "Paid" } });
  const pendingFees = await prisma.fee.count({ where: { teacherId, status: "Pending" } });

  const attendanceRecords = await prisma.attendance.findMany({ where: { teacherId } });
  const presentCount = attendanceRecords.filter((a) => a.status === "Present").length;
  const attendancePercentage = attendanceRecords.length
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : 0;

  const marksEntered = await prisma.mark.count({ where: { teacherId } });

  const [recentStudents, recentFees, recentAttendance, recentMarks] =
    await Promise.all([
      prisma.student.findMany({
        where: { teacherId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { class: true, section: true },
      }),
      prisma.fee.findMany({
        where: { teacherId, status: "Paid", paymentDate: { not: null } },
        orderBy: { paymentDate: "desc" },
        take: 5,
        include: { student: true },
      }),
      prisma.attendance.findMany({
        where: { teacherId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { student: { include: { class: true, section: true } } },
      }),
      prisma.mark.findMany({
        where: { teacherId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { student: true, exam: true },
      }),
    ]);

  const recentActivities = [
    ...recentStudents.map((s) => ({
      icon: "👤",
      text: `${s.name} added to Class ${s.class.name}-${s.section.name}`,
      timestamp: s.createdAt,
    })),
    ...recentFees.map((f) => ({
      icon: "💰",
      text: `Fee received from ${f.student.name} (${f.term})`,
      timestamp: f.paymentDate as Date,
    })),
    ...recentAttendance.map((a) => ({
      icon: "📅",
      text: `Attendance marked for ${a.student.name} (Class ${a.student.class.name}-${a.student.section.name})`,
      timestamp: a.createdAt,
    })),
    ...recentMarks.map((m) => ({
      icon: "📝",
      text: `${m.exam.name} marks entered for ${m.student.name} (${m.subject})`,
      timestamp: m.createdAt,
    })),
  ]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 6);

  const cards = [
    { label: "Total Students", value: totalStudents.toString(), icon: Users, note: "Registered students" },
    { label: "Attendance", value: `${attendancePercentage}%`, icon: CalendarCheck2, note: "Overall attendance" },
    { label: "Fees Collected", value: paidFees.toString(), icon: IndianRupee, note: "Paid fee records" },
    { label: "Marks Entered", value: marksEntered.toString(), icon: ClipboardList, note: "Exam mark records" },
  ];

  return (
    <div className="space-y-6">
      <WelcomeHeader teacherName={teacherName} />

      <div className="flex items-end justify-between">
        <div>
          <h3 className="display-font text-3xl font-semibold text-[var(--ink)]">
            Analytics Overview
          </h3>
          <p className="mt-1 text-sm text-[var(--stone)]">
            Student, attendance, and fee analytics
          </p>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <PaperCard key={card.label} className="gap-3">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--teal)]/10 text-[var(--teal)]">
                <card.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Live
              </span>
            </div>
            <div>
              <p className="text-sm text-[var(--stone)]">{card.label}</p>
              <p className="display-font mt-1 text-3xl font-semibold text-[var(--ink)]">
                {card.value}
              </p>
            </div>
            <p className="text-xs text-[var(--stone)]">{card.note}</p>
          </PaperCard>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <PaperCard className="gap-2">
          <p className="text-sm text-[var(--stone)]">Classes</p>
          <p className="display-font text-3xl font-semibold text-[var(--ink)]">{totalClasses}</p>
        </PaperCard>
        <PaperCard className="gap-2">
          <p className="text-sm text-[var(--stone)]">Sections</p>
          <p className="display-font text-3xl font-semibold text-[var(--ink)]">{totalSections}</p>
        </PaperCard>
        <PaperCard className="gap-2">
          <p className="text-sm text-[var(--stone)]">Pending Fees</p>
          <p className="display-font text-3xl font-semibold text-[var(--ink)]">{pendingFees}</p>
        </PaperCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <PaperCard className="gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">{monthName}</h3>
              <p className="text-sm text-[var(--stone)]">School calendar</p>
            </div>
            <span className="rounded-full bg-[var(--teal)]/10 px-3 py-1 text-xs font-medium text-[var(--teal)]">
              Today
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-[var(--stone)]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="py-2">{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`flex h-10 items-center justify-center rounded-lg text-sm transition ${
                  day === today.getDate()
                    ? "bg-[var(--teal)] text-white font-semibold shadow-sm"
                    : day
                    ? "border border-[var(--paper-dark)] bg-white text-[var(--ink)] hover:bg-[#fffaf0]"
                    : ""
                }`}
              >
                {day || ""}
              </div>
            ))}
          </div>

          <div className="mt-2 rounded-xl border border-[var(--paper-dark)] bg-[#fffaf0] p-3 text-sm text-[var(--stone)]">
            Attendance marked today:{" "}
            <span className="font-semibold text-[var(--ink)]">Yes</span>
          </div>
        </PaperCard>

        <PaperCard className="gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="display-font text-2xl font-semibold text-[var(--ink)]">Recent Activities</h3>
              <p className="text-sm text-[var(--stone)]">Latest updates from your register</p>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Live
            </span>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-sm text-[var(--stone)]">
                No activity yet — add a student or mark attendance to see it here.
              </p>
            ) : (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--paper)] text-lg">
                    {activity.icon}
                  </div>
                  <div className="flex-1 border-b border-[var(--paper-dark)] pb-3 last:border-0 last:pb-0">
                    <p className="text-sm font-medium text-[var(--ink)]">{activity.text}</p>
                    <p className="mt-1 text-xs text-[var(--stone)]">{timeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </PaperCard>
      </section>
    </div>
  );
}