import { cookies } from 'next/headers'

export interface Session {
  userId: string
}

const DEV_USER_ID = process.env.DEV_USER_ID ?? '00000000-0000-0000-0000-000000000001'

const COOKIE_NAME = 'sb-kcawuvrvrxvzzrpuginw-auth-token'

function userIdFromCookie(cookieValue: string): string | null {
  try {
    const session = JSON.parse(cookieValue)
    const [, payloadB64] = (session.access_token as string).split('.')
    const padding = (4 - (payloadB64.length % 4)) % 4
    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding)
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf-8'))
    return payload.sub ?? null
  } catch {
    return null
  }
}

// ─── Para Server Components y Server Actions ──────────────────────────────────
export async function getSession(): Promise<Session | null> {
  if (process.env.SKIP_AUTH === 'true') {
    return { userId: DEV_USER_ID }
  }

  const cookieStore = cookies()
  const authCookie = cookieStore.get(COOKIE_NAME)
  if (!authCookie) return null

  const userId = userIdFromCookie(authCookie.value)
  if (!userId) return null

  return { userId }
}

// ─── Para API Routes (Route Handlers) ────────────────────────────────────────
export function getUserIdFromRequest(request: Request): string | null {
  if (process.env.SKIP_AUTH === 'true') {
    return DEV_USER_ID
  }

  // Primero intentar el header legacy x-user-id
  const fromHeader = request.headers.get('x-user-id')
  if (fromHeader) return fromHeader

  // Fallback: decodificar JWT desde la cookie del request
  const cookieHeader = request.headers.get('cookie') ?? ''
  const match = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(COOKIE_NAME + '='))

  if (!match) return null

  const cookieValue = decodeURIComponent(match.slice(COOKIE_NAME.length + 1))
  return userIdFromCookie(cookieValue)
}

// ─── Helper para API routes que requieren autenticacion obligatoria ───────────
export class ApiAuthError extends Error {
  readonly statusCode = 401
  constructor() {
    super('No autorizado')
    this.name = 'ApiAuthError'
  }
}

export function requireUserId(request: Request): string {
  const userId = getUserIdFromRequest(request)
  if (!userId) throw new ApiAuthError()
  return userId
}
