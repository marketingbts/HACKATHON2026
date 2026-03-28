import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_BUSINESS } from '@/lib/mock-data'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  return NextResponse.json(MOCK_BUSINESS)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  // TODO: persistir en Supabase
  const created = {
    ...MOCK_BUSINESS,
    ...body,
    userId: session.userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(created, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  // TODO: actualizar en Supabase
  const updated = {
    ...MOCK_BUSINESS,
    ...body,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(updated)
}
