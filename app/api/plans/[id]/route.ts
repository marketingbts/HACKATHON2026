import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapContentPlan, mapContentPost, mapAudience, mapProduct } from '@/lib/mappers'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: plan, error } = await supabase
    .from('content_plans')
    .select('*')
    .eq('id', params.id)
    .eq('business_id', business.id)
    .single()

  if (error || !plan) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
  }

  const [
    { data: posts },
    { data: planAudiences },
    { data: planProducts },
  ] = await Promise.all([
    supabase.from('content_posts').select('*').eq('plan_id', plan.id).order('scheduled_date'),
    supabase.from('content_plan_audiences').select('audience_id').eq('plan_id', plan.id),
    supabase.from('content_plan_products').select('product_id').eq('plan_id', plan.id),
  ])

  const audienceIds = (planAudiences ?? []).map((r) => r.audience_id)
  const productIds = (planProducts ?? []).map((r) => r.product_id)

  const [{ data: audiences }, { data: products }] = await Promise.all([
    audienceIds.length
      ? supabase.from('audiences').select('*').in('id', audienceIds)
      : Promise.resolve({ data: [] }),
    productIds.length
      ? supabase.from('products').select('*').in('id', productIds)
      : Promise.resolve({ data: [] }),
  ])

  return NextResponse.json({
    ...mapContentPlan(plan),
    posts: (posts ?? []).map(mapContentPost),
    audiences: (audiences ?? []).map(mapAudience),
    products: (products ?? []).map(mapProduct),
  })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.status !== undefined) updates.status = body.status

  const { data, error } = await supabase
    .from('content_plans')
    .update(updates)
    .eq('id', params.id)
    .eq('business_id', business.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
  }

  return NextResponse.json(mapContentPlan(data))
}
