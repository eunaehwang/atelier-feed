import { cookies } from 'next/headers'

const SESSION_COOKIE = 'atelier_access'
const MAX_AGE = 60 * 60 * 24 * 7 // 7일

export async function getSessionCode(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export async function setSessionCode(code: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, code, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  })
}

export async function clearSessionCode() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
