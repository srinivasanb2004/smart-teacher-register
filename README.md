# Smart Teacher Register 📚

## 🆕 Latest Update — read this before running

This update is UI/UX fixes plus a full visual refresh. No database migration is needed this time — nothing in the schema changed.

1. **Mobile layout fixes**: the "Add Year" button (Academic Years page) and "Create Exam" button (Marks page) no longer overflow off-screen on small phones — the input/button row now stacks vertically on mobile.
2. **Fee ledger horizontal scroll fixed**: on a student's Fee Ledger page, you can now scroll sideways on mobile to reach the Paid/Pending action buttons — the table was missing a scroll wrapper.
3. **Student search now actually works**: the search box in the top bar used to do nothing at all, and was hidden on mobile. It's now a real live search (by name, roll no, or admission no) that shows matching students and jumps straight to their profile — visible on every screen size, on every dashboard page.
4. **Notification bell is now functional**: it shows a real count of pending fee payments and takes you to the Fees page when clicked, instead of being a dead icon.
5. **Full visual refresh**: moved off the generic blue/indigo look to a warm palette (parchment background, deep teal primary color, amber accent, warm neutral grays) grounded in what the app actually is — a digital version of a teacher's attendance register. Added a proper heading typeface (Sora) alongside the existing body font (Inter), and a subtle ruled-line texture on the landing page hero as a nod to the "register" concept.

### A note on fonts

This update adds `next/font/google` (Sora + Inter) to `app/layout.tsx`. This is a completely standard, first-party Next.js feature and works out of the box on Vercel — no setup needed, nothing to configure. It just needs normal internet access during the build to fetch the font files once, which every real build environment (including Vercel) has.

---

## Update history

<details>
<summary>Previous update — auth, multi-tenancy, fees restructure, delete buttons (click to expand)</summary>

1. **Academic Years** is now linked in the sidebar (the page already existed, it just wasn't reachable before).
2. **Fees dashboard** now has filters for Class, Section, and Term.
3. **Student marksheet** now has an Exam filter — pick an exam (e.g. Quarterly) and only that exam's marks, total, and percentage are shown.
4. **Classes** and **Sections** tables now have a Delete button. Deleting a class/section also deletes everything under it (its sections/students and their attendance, marks, and fees) — you'll get a confirmation prompt first.
5. **Fees structure changed completely**: it used to auto-create 12 fixed ₹1000 "monthly" fee rows for every new student. Now nothing is created automatically — the teacher manually enters an amount for **Term 1 / Term 2 / Term 3** on each student's Fee Ledger page, then marks it Paid/Pending. The fees dashboard's term filter matches this.
6. **Dark mode has been removed** — the toggle button, its component, and all related CSS are gone.

### ⚠️ Database migration required (breaking change, already applied if you ran this before)

Because the fee structure changed (`month` column → `term` column, and the auto-generated monthly fee rows are gone), a migration was needed. **This cleared out any existing Fee records** — they were just system-generated ₹1000 placeholders anyway, so this was expected and safe.

```bash
npx prisma migrate dev
```

</details>

---

A modern **School ERP / Student Management System** built with **Next.js 15, TypeScript, Prisma, and PostgreSQL**. The application is designed for individual teachers and schools to manage students, attendance, marks, fees, and reports from a single dashboard.

## ✨ Features

### 👨‍🏫 Teacher Authentication


* Teacher Registration
* Teacher Login / Logout
* JWT-based authentication
* Protected dashboard routes

### 🏫 Academic Management

* Create Academic Years
* Manage Classes
* Manage Sections

### 👨‍🎓 Student Management

* Add / Edit / Delete Students
* Parent information
* Roll number and admission number tracking
* Search and pagination

### 📅 Attendance

* Daily attendance entry
* Bulk attendance for a section
* Attendance percentage calculation
* Monthly attendance reports

### 📝 Marks & Exams

* Create exams
* Bulk marks entry
* Subject-wise marks
* Automatic percentage calculation
* Printable marksheet view

### 💰 Fees Management

* Monthly fee tracking
* Paid / Pending status
* Mark fee as paid
* Student fee ledger
* Fee summary dashboard

### 📊 Reports & Analytics

* Dashboard analytics cards
* Charts and statistics
* Student reports
* Attendance reports
* Marks reports
* Export-ready UI

### 🎨 UI/UX

* Responsive design
* Mobile-friendly dashboard
* Dark mode support
* Modern Slate + Indigo theme
* Animated counters on landing page

---
## 🛠️ Tech Stack

### Frontend

* Next.js 15 (App Router)
* React 19
* TypeScript
* Tailwind CSS
* Lucide React Icons

### Backend

* Next.js API Routes
* Prisma ORM
* PostgreSQL (Neon)

### Deployment

* Vercel
* Neon PostgreSQL

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/srinivasanb2004/smart-teacher-register.git
cd smart-teacher-register
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
```

### 4. Generate Prisma client

```bash
npx prisma generate
```

### 5. Apply database migrations

```bash
npx prisma migrate dev
```

> This project uses Prisma Migrate (not `db push`) — a `prisma/migrations` folder is already tracked in this repo, so always use `migrate dev` (locally) / `migrate deploy` (production) to keep your database in sync with it.

### 6. Run the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🌐 Live Demo

🔗 **Live Application:** [ https://smart-teacher-register-pej4-j44oh09a6.vercel.app/] 

---

## 📦 Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL**.

### Applying this update to production

The build command does **not** run migrations automatically, so before (or right after) you push this update to Vercel, run the migration against your **production** database once from your local machine:

```bash
DATABASE_URL="your_production_neon_connection_string" npx prisma migrate deploy
```

Skipping this step will break the live app, since the deployed code expects the new `term` column on the `Fee` table.

### Build Command

```bash
prisma generate && next build
```

### Environment Variables on Vercel

* `DATABASE_URL`
* `JWT_SECRET`

---

## 📈 Future Improvements

* Multi-tenant teacher isolation
* Role-based access (Admin / Teacher)
* Email notifications
* PDF export
* Excel export
* Parent portal
* Mobile app (React Native)

---

## 👨‍💻 Author

**Srinivasan B**

* 🎓 B.Sc Information Technology (2024)
* 💼 Full Stack Developer
* 🌍 Tamilnadu / India

### Connect with me

* GitHub: https://github.com/srinivasanb2004
* LinkedIn: https://www.linkedin.com/in/srinivasan2004/

---

## ⭐ Support

If you found this project useful, please **star the repository** ⭐ on GitHub.

---

## 📄 License

This project is licensed under the **MIT License**.
