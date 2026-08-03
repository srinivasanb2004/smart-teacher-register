# Smart Teacher Register 📚

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

### 5. Push database schema

```bash
npx prisma db push
```

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
