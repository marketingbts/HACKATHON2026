import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const { data: plans, error } = await supabase
    .from('content_plans')
    .select('id, objective')
    .eq('business_id', business.id)
    .eq('status', 'active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!plans?.length) return NextResponse.json({ entries: [] })

  const planIds = plans.map((p) => p.id)

  const { data: posts } = await supabase
    .from('content_posts')
    .select('*')
    .in('plan_id', planIds)
    .order('scheduled_date')

  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.objective]))

  const entries = (posts ?? []).map((post) => ({
    date: post.scheduled_date,
    planId: post.plan_id,
    planObjective: planMap[post.plan_id] ?? null,
    postId: post.id,
    network: post.network,
    format: post.format,
    copy: post.copy,
    imageSuggestion: post.image_suggestion,
  }))

  return NextResponse.json({ entries })
}
