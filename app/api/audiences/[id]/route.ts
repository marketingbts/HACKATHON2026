import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_BUSINESS } from '@/lib/mock-data'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const existing = MOCK_BUSINESS.audiences.find((a) => a.id === params.id)
  if (!existing) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  // TODO: actualizar en Supabase
  return NextResponse.json({ ...existing, ...body })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // TODO: eliminar en Supabase
  return NextResponse.json({ deleted: params.id })
}
