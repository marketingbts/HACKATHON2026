import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_CALENDAR } from '@/lib/mock-data'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // TODO: obtener de Supabase todos los posts de planes activos del usuario
  return NextResponse.json(MOCK_CALENDAR)
}
