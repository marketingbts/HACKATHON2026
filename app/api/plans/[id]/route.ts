import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_PLANS } from '@/lib/mock-data'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const plan = MOCK_PLANS.find((p) => p.id === params.id) ?? MOCK_PLANS[0]

  return NextResponse.json(plan)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const plan = MOCK_PLANS.find((p) => p.id === params.id) ?? MOCK_PLANS[0]

  // TODO: actualizar en Supabase
  return NextResponse.json({ ...plan, ...body, updatedAt: new Date().toISOString() })
}
