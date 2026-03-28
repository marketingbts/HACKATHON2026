import { headers } from 'next/headers'

export interface Session {
  userId: string
}

const DEV_USER_ID = process.env.DEV_USER_ID ?? '00000000-0000-0000-0000-000000000001'

// ─── Para Server Components y Server Actions ──────────────────────────────────
export async function getSession(): Promise<Session | null> {
  if (process.env.SKIP_AUTH === 'true') {
    return { userId: DEV_USER_ID }
  }

  const headersList = headers()
  const userId = headersList.get('x-user-id')
  if (!userId) return null

  return { userId }
}

// ─── Para API Routes (Route Handlers) ────────────────────────────────────────
export function getUserIdFromRequest(request: Request): string | null {
  if (process.env.SKIP_AUTH === 'true') {
    return DEV_USER_ID
  }

  return request.headers.get('x-user-id')
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
