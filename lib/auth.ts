import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

export const SESSION_COOKIE = "str_session"

const JWT_SECRET = process.env.JWT_SECRET

function getSecretKey() {
  if (!JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your .env file (see .env.example)."
    )
  }
  return new TextEncoder().encode(JWT_SECRET)
}

export type SessionPayload = {
  teacherId: number
  email: string
  name: string
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecretKey())
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// Use in Server Components / Route Handlers (Node runtime) to read the
// currently logged-in teacher from the session cookie.
export async function getCurrentTeacher(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value

  if (!token) return null

  return verifySessionToken(token)
}

// Convenience helper for Route Handlers that must be authenticated.
// Throws so callers can catch and return a 401.
export async function requireTeacher(): Promise<SessionPayload> {
  const teacher = await getCurrentTeacher()

  if (!teacher) {
    throw new Error("UNAUTHENTICATED")
  }

  return teacher
}
