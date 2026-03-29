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
  const { 
    objective, 
    tone, 
    periodStart, 
    periodEnd, 
    strategySummary, 
    recommendedActions, 
    audienceIds, 
    productIds, 
    posts 
  } = body

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  // 1. Crear el plan
  const { data: plan, error: planError } = await supabase
    .from('content_plans')
    .insert({
      business_id: business.id,
      objective,
      tone,
      period_start: periodStart,
      period_end: periodEnd,
      strategy_summary: strategySummary,
      recommended_actions: recommendedActions,
      status: 'active',
    })
    .select()
    .single()

  if (planError || !plan) {
    return NextResponse.json({ error: planError?.message ?? 'Error al crear el plan' }, { status: 500 })
  }

  const insertPromises = []

  // 2. Asociar audiencias
  if (audienceIds?.length) {
    insertPromises.push(
      supabase.from('content_plan_audiences').insert(
        audienceIds.map((id: string) => ({ plan_id: plan.id, audience_id: id }))
      )
    )
  }

  // 3. Asociar productos
  if (productIds?.length) {
    insertPromises.push(
      supabase.from('content_plan_products').insert(
        productIds.map((id: string) => ({ plan_id: plan.id, product_id: id }))
      )
    )
  }

  // 4. Guardar los posts seleccionados
  if (posts?.length) {
    insertPromises.push(
      supabase.from('content_posts').insert(
        posts.map((p: any) => ({
          plan_id: plan.id,
          scheduled_date: p.scheduledDate,
          network: p.network,
          format: p.format,
          copy: p.copy,
          image_suggestion: p.imageSuggestion,
        }))
      )
    )
  }

  const results = await Promise.all(insertPromises)
  const error = results.find(r => r.error)
  if (error) {
    // Si algo falla, el plan ya se creó, pero lanzamos error para que el frontend sepa
    return NextResponse.json({ error: 'Error al guardar relaciones o posts' }, { status: 500 })
  }

  return NextResponse.json(mapContentPlan(plan), { status: 201 })
}
