import { headers } from 'next/headers'

export interface Session {
  userId: string
}

// ─── Para Server Components y Server Actions ──────────────────────────────────
// Usa `next/headers` para leer el header x-user-id inyectado por el middleware.

export async function getSession(): Promise<Session | null> {
  if (process.env.SKIP_AUTH === 'true') {
    return { userId: 'dev-user-id' }
  }

  const headersList = headers()
  const userId = headersList.get('x-user-id')
  if (!userId) return null

  return { userId }
}

// ─── Para API Routes (Route Handlers) ────────────────────────────────────────
// Recibe el objeto Request nativo de la API route y extrae el userId
// del header que el middleware inyecta en cada request autenticado.
//
// Uso en una API route:
//   const userId = getUserIdFromRequest(request)
//   if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

export function getUserIdFromRequest(request: Request): string | null {
  if (process.env.SKIP_AUTH === 'true') {
    return 'dev-user-id'
  }

  return request.headers.get('x-user-id')
}

// ─── Helper para API routes que requieren autenticacion obligatoria ───────────
// Lanza un error tipado si no hay sesion; simplifica el boilerplate en las routes.
//
// Uso:
//   const userId = requireUserId(request)  // lanza ApiAuthError si no hay sesion

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
