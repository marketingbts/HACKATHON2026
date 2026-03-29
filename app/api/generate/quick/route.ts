import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapBusiness, mapAudience, mapProduct } from '@/lib/mappers'
import { buildQuickPrompt } from '@/lib/prompts'
import { generatePlanContent } from '@/lib/ai'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { format, productId, audienceName, detail } = body

  if (!format) {
    return NextResponse.json({ error: 'El campo format es obligatorio' }, { status: 400 })
  }

  // 1. Contexto del negocio
  const { data: businessRow } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', session.userId)
    .single()

  if (!businessRow) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const [{ data: audienceRows }, { data: productRows }] = await Promise.all([
    supabase.from('audiences').select('*').eq('business_id', businessRow.id),
    supabase.from('products').select('*').eq('business_id', businessRow.id),
  ])

  const business  = mapBusiness(businessRow)
  const audiences = (audienceRows ?? []).map(mapAudience)
  const products  = (productRows ?? []).map(mapProduct)

  // 2. Nombre del producto seleccionado (si se pasó productId)
  const productName = productId
    ? products.find(p => p.id === productId)?.name
    : undefined

  // 3. Llamar a la IA
  const promptBody = buildQuickPrompt({
    business,
    audiences,
    products,
    format,
    productName,
    audienceName,
    detail,
  })

  let aiRaw: string
  try {
    aiRaw = await generatePlanContent(promptBody)
  } catch {
    try {
      aiRaw = await generatePlanContent(promptBody)
    } catch {
      return NextResponse.json(
        { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
        { status: 503 }
      )
    }
  }

  // 4. Parsear respuesta
  try {
    const parsed = JSON.parse(aiRaw)
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(
      { error: 'No pudimos generar el contenido. Verificá tu conexión e intentá de nuevo.' },
      { status: 503 }
    )
  }
}
