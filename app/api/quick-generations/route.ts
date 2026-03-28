import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_QUICK_GENERATIONS } from '@/lib/mock-data'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  return NextResponse.json(MOCK_QUICK_GENERATIONS)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  // TODO: persistir en Supabase
  const created = {
    id: `quick-${Date.now()}`,
    businessId: 'biz-001',
    format: body.format,
    productId: body.productId ?? null,
    audienceName: body.audienceName ?? null,
    detail: body.detail ?? null,
    copy: body.copy,
    imageSuggestion: body.imageSuggestion ?? null,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json(created, { status: 201 })
}
