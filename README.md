# Smart Teacher Register

A multi-tenant school management app. **Every teacher creates their own account
and gets a fully isolated workspace** — their own academic years, classes,
sections, students, attendance, marks, and fees. Teachers can never see or
modify each other's data.

## What changed in this update

The original project had a hardcoded login (`admin@sms.com` / `admin123`) and
no concept of separate teacher accounts — all data was shared globally. This
version adds:

- **Real signup/login** — `Teacher` accounts with bcrypt-hashed passwords and
  signed JWT session cookies (`lib/auth.ts`).
- **Per-teacher data isolation** — every model (`AcademicYear`, `SchoolClass`,
  `Section`, `Student`, `Exam`, `Attendance`, `Mark`, `Fee`, `AppSettings`) now
  has a `teacherId`. Every API route filters and validates ownership by the
  logged-in teacher's id before reading or writing anything.
- **Route protection** — `middleware.ts` blocks access to `/dashboard/*` and
  any `/api/*` route (except `/api/auth/*`) unless you're logged in.
- **New pages** — `/register` (sign up) and a rebuilt `/login`.
- Fixed a duplicate `AcademicYear` model definition in `schema.prisma` that
  would have prevented `prisma generate` from working at all, and added the
  missing `AppSettings` model referenced by the settings page.

## Tech stack

Next.js (App Router) · Prisma · PostgreSQL · Tailwind CSS · bcryptjs · jose (JWT)

## Setup (run this locally in VS Code)

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a PostgreSQL database.** Any Postgres works — local install,
   Docker, or a free hosted one (Neon, Supabase, Railway, etc). Example for a
   local install:

   ```sql
   CREATE DATABASE smart_teacher_dev;
   ```

3. **Configure environment variables.** Copy the example file and fill it in:

   ```bash
   cp .env.example .env
   ```

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_teacher_dev?schema=public"
   JWT_SECRET="a-long-random-string"   # generate with: openssl rand -base64 32
   ```

4. **Create the database tables.** This project's schema changed significantly
   (added the `Teacher` table and `teacherId` on every model), so run a fresh
   migration:

   ```bash
   npx prisma migrate dev --name init
   ```

   This also runs `prisma generate` for you automatically.

5. **Run the app**

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`, click **Get Started**, and create your first
   teacher account at `/register`. You'll be dropped straight into your own
   dashboard with a default academic year already created for you.

## How the multi-tenancy works

- On signup, a `Teacher` row is created (password hashed with bcrypt) and a
  signed session cookie is set.
- `middleware.ts` checks that cookie on every request to `/dashboard/*` and
  `/api/*`, redirecting to `/login` (or returning `401` for API calls) if it's
  missing or invalid.
- Every API route calls `withTeacher(...)` (`lib/withTeacher.ts`), which reads
  the teacher id out of the session and scopes every Prisma query with
  `where: { teacherId }`. Routes that link to existing records (e.g. adding a
  student to a class/section) also verify that the referenced record belongs
  to the same teacher before allowing it.
- Server-rendered dashboard pages that query Prisma directly (e.g. the main
  dashboard, student profile, reports) call `getCurrentTeacher()` and scope
  their queries the same way.

## Deploying

Once it's running locally the way you want:

1. Push this project to your own GitHub repo.
2. Deploy on Vercel (or any Node host). Set the same `DATABASE_URL` and
   `JWT_SECRET` environment variables in your host's dashboard, pointing
   `DATABASE_URL` at your production Postgres (e.g. Neon/Supabase/Railway).
3. Run `npx prisma migrate deploy` against the production database (Vercel
   can do this in a build step, or run it once manually) before first use.

## Project structure (high level)

```
app/
  login/           – login page
  register/        – signup page
  dashboard/        – protected teacher dashboard (students, attendance, marks, fees, reports, settings)
  api/
    auth/          – register, login, logout, me
    ...            – all other CRUD routes, each scoped per teacher
lib/
  auth.ts          – password hashing + JWT session helpers
  withTeacher.ts   – wraps API handlers with an auth check
  prisma.ts        – Prisma client singleton
middleware.ts      – route protection
prisma/schema.prisma – Teacher model + teacherId on every other model
```
