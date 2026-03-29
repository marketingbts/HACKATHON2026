import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapQuickGeneration } from '@/lib/mappers'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const { data, error } = await supabase
    .from('quick_generations')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json((data ?? []).map(mapQuickGeneration))
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { format, productId, audienceName, detail, copy, imageSuggestion } = body

  if (!copy) {
    return NextResponse.json({ error: 'El campo copy es obligatorio' }, { status: 400 })
  }

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })

  const { data, error } = await supabase
    .from('quick_generations')
    .insert({
      business_id: business.id,
      format: format ?? null,
      product_id: productId ?? null,
      audience_name: audienceName ?? null,
      detail: detail ?? null,
      copy,
      image_suggestion: imageSuggestion ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(mapQuickGeneration(data), { status: 201 })
}
