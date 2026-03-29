import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  // Modo desarrollo: saltear auth
  if (process.env.SKIP_AUTH === 'true') {
    const res = NextResponse.next()
    res.headers.set('x-user-id', 'dev-user-id')
    return res
  }

  // Verificar sesión via cookie de Supabase Auth v2.
  // El formato real es: sb-<project-ref>-auth-token
  // Como el project-ref varía por proyecto, buscamos cualquier cookie que
  // empiece con "sb-" y termine en "-auth-token".
  const authCookie = request.cookies.getAll().find(
    (c) => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Inyectar x-user-id para que las API routes puedan leerlo sin re-validar.
  // En produccion este valor deberia venir del JWT decodificado; por ahora
  // el header lo setea el cliente via Supabase Auth antes del redirect.
  const res = NextResponse.next()
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
