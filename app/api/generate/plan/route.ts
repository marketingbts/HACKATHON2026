import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapBusiness, mapAudience, mapProduct } from '@/lib/mappers'
import { buildPlanPrompt } from '@/lib/prompts'
import { generatePlanContent } from '@/lib/ai'
import type { AIVariant } from '@/lib/types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

const PERIOD_DAYS: Record<string, number> = { day: 1, week: 7, month: 30 }

type AIPlanResponse = {
  strategy_summary: {
    approach: string
    content_focus: string
    timeline_explanation: string
  }
  posts: Array<{
    date: string  // YYYY-MM-DD — calculado por la IA con el time_context
    type: string
    goal: string
    copies: Array<{ text: string; visual_description: string }>
  }>
  recommended_actions: string[]
  calendar: Array<{
    date: string
    action: string
    type: string
    goal: string
    suggested_time: string
  }>
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function callAIWithRetry(promptBody: object): Promise<string> {
  try {
    return await generatePlanContent(promptBody)
  } catch {
    return await generatePlanContent(promptBody)  // un reintento automático
  }
}

function buildStrategySummary(s: AIPlanResponse['strategy_summary']): string {
  return [s?.approach, s?.content_focus, s?.timeline_explanation]
    .filter(Boolean)
    .join(' ')
}

function mapPostsToVariants(posts: AIPlanResponse['posts'], network: string) {
  return posts.map((post) => {
    const variants: AIVariant[] = (post.copies ?? []).slice(0, 3).map((copy, i) => ({
      variant: (i + 1) as 1 | 2 | 3,
      copy: copy.text,
      imageSuggestion: copy.visual_description,
    }))

    return {
      scheduledDate: post.date,
      network,
      format: post.type,
      variants,
    }
  })
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { objective, tone, period, audienceIds, productIds, detail, feedback, previousPlan } = body

  if (!objective || !tone || !period) {
    return NextResponse.json({ error: 'Faltan campos obligatorios: objective, tone, period' }, { status: 400 })
  }
  if (!PERIOD_DAYS[period]) {
    return NextResponse.json({ error: 'period debe ser day, week o month' }, { status: 400 })
  }

  // 1. Negocio
  const { data: businessRow } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', session.userId)
    .single()

  if (!businessRow) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  // 2. Audiencias y productos (todos + seleccionados)
  const [
    { data: allAudienceRows },
    { data: allProductRows },
    { data: selectedAudienceRows },
    { data: selectedProductRows },
  ] = await Promise.all([
    supabase.from('audiences').select('*').eq('business_id', businessRow.id),
    supabase.from('products').select('*').eq('business_id', businessRow.id),
    audienceIds?.length
      ? supabase.from('audiences').select('*').in('id', audienceIds)
      : Promise.resolve({ data: [] }),
    productIds?.length
      ? supabase.from('products').select('*').in('id', productIds)
      : Promise.resolve({ data: [] }),
  ])

  const business          = mapBusiness(businessRow)
  const allAudiences      = (allAudienceRows ?? []).map(mapAudience)
  const allProducts       = (allProductRows ?? []).map(mapProduct)
  const selectedAudiences = (selectedAudienceRows ?? []).map(mapAudience)
  const selectedProducts  = (selectedProductRows ?? []).map(mapProduct)

  // 3. Llamar a la IA
  const promptBody = buildPlanPrompt({
    business, audiences: allAudiences, products: allProducts,
    objective, selectedAudiences, selectedProducts, tone, period, detail,
    ...(feedback && { feedback }),
    ...(previousPlan && { previousPlan }),
  })

  // Si viene feedback, es un refinamiento: no crear plan en DB, solo generar y devolver
  if (feedback) {
    let aiRaw: string
    try {
      aiRaw = await callAIWithRetry(promptBody)
    } catch {
      return NextResponse.json(
        { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
        { status: 503 }
      )
    }

    let parsed: AIPlanResponse
    try {
      parsed = JSON.parse(aiRaw)
    } catch {
      return NextResponse.json(
        { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
        { status: 503 }
      )
    }

    // Devolver en el mismo formato que la página espera (igual al raw AI response con date→day)
    return NextResponse.json({
      strategy_summary: parsed.strategy_summary,
      recommended_actions: parsed.recommended_actions ?? [],
      posts: (parsed.posts ?? []).map((p) => ({ ...p, day: p.date })),
      calendar: (parsed.calendar ?? []).map((e) => ({ ...e, day: e.date })),
    })
  }

  // 4. Llamar a la IA
  let aiRaw: string
  try {
    aiRaw = await callAIWithRetry(promptBody)
  } catch {
    return NextResponse.json(
      { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
      { status: 503 }
    )
  }

  // 5. Parsear respuesta
  let parsed: AIPlanResponse
  try {
    parsed = JSON.parse(aiRaw)
  } catch {
    return NextResponse.json(
      { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
      { status: 503 }
    )
  }

  // 6. Armar respuesta
  const strategySummary = buildStrategySummary(parsed.strategy_summary)
  const network = business.socialNetworks[0] ?? 'instagram'
  const posts = mapPostsToVariants(parsed.posts ?? [], network)

  return NextResponse.json({
    strategySummary,
    recommendedActions: parsed.recommended_actions ?? [],
    posts,
    calendar: (parsed.calendar ?? []).map((e) => ({
      date: e.date,
      action: e.action,
      type: e.type,
      goal: e.goal,
      suggestedTime: e.suggested_time,
    })),
  })
}
