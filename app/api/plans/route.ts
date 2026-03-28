import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_PLANS } from '@/lib/mock-data'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  const plans = status ? MOCK_PLANS.filter((p) => p.status === status) : MOCK_PLANS

  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  // TODO: persistir en Supabase
  const created = {
    ...MOCK_PLANS[0],
    id: `plan-${Date.now()}`,
    ...body,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json(created, { status: 201 })
}
