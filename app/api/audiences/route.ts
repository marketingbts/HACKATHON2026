import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_BUSINESS } from '@/lib/mock-data'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  // TODO: persistir en Supabase
  const created = {
    id: `aud-${Date.now()}`,
    businessId: MOCK_BUSINESS.id,
    name: body.name,
    description: body.description ?? null,
    ageRange: body.ageRange ?? null,
    interests: body.interests ?? null,
    behavior: body.behavior ?? null,
    networks: body.networks ?? [],
    location: body.location ?? null,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(created, { status: 201 })
}
