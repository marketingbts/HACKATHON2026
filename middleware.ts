import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/login', '/registro']

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

  // Verificar sesión via cookie (Supabase Auth — a implementar)
  const session = request.cookies.get('sb-access-token')
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
