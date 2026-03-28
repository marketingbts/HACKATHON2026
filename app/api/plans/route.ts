import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapContentPlan } from '@/lib/mappers'

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('content_plans')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json((data ?? []).map(mapContentPlan))
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { objective, tone, periodStart, periodEnd, audienceIds, productIds } = body

  if (!objective || !tone || !periodStart || !periodEnd) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const { data: plan, error: planError } = await supabase
    .from('content_plans')
    .insert({
      business_id: business.id,
      objective,
      tone,
      period_start: periodStart,
      period_end: periodEnd,
      status: 'active',
    })
    .select()
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: planError?.message ?? 'Error al crear el plan' }, { status: 500 })
  }

  const insertPromises = []

  if (audienceIds?.length) {
    insertPromises.push(
      supabase.from('content_plan_audiences').insert(
        audienceIds.map((id: string) => ({ plan_id: plan.id, audience_id: id }))
      ).then()
    )
  }

  if (productIds?.length) {
    insertPromises.push(
      supabase.from('content_plan_products').insert(
        productIds.map((id: string) => ({ plan_id: plan.id, product_id: id }))
      ).then()
    )
  }

  await Promise.all(insertPromises)

  return NextResponse.json(mapContentPlan(plan), { status: 201 })
}
