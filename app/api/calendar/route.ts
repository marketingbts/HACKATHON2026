import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
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

  const planIds = (plans ?? []).map((p) => p.id)

  let posts: any[] = []
  if (planIds.length > 0) {
    const { data: postsData } = await supabase
      .from('content_posts')
      .select('*')
      .in('plan_id', planIds)
      .order('scheduled_date')
    posts = postsData ?? []
  }

  const { data: quickGens } = await supabase
    .from('quick_generations')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  const planMap = Object.fromEntries(plans.map((p) => [p.id, p.objective]))

  const planEntries = (posts ?? []).map((post) => ({
    date: post.scheduled_date,
    planId: post.plan_id,
    planObjective: planMap[post.plan_id] ?? null,
    postId: post.id,
    network: post.network,
    format: post.format,
    copy: post.copy,
    imageSuggestion: post.image_suggestion,
    source: 'plan'
  }))

  const quickEntries = (quickGens ?? []).map((gen) => ({
    date: gen.created_at.split('T')[0],
    planId: null,
    planObjective: 'Generación Rápida',
    postId: gen.id,
    network: 'Instagram', // Por ahora asumimos Instagram para quick gens
    format: gen.format,
    copy: gen.copy,
    imageSuggestion: gen.image_suggestion,
    source: 'quick'
  }))

  const allEntries = [...planEntries, ...quickEntries].sort((a, b) => {
    const dateA = a.date ?? ''
    const dateB = b.date ?? ''
    return dateB.localeCompare(dateA)
  })

  return NextResponse.json({ 
    planEntries,
    quickEntries,
    entries: allEntries
  })
}
