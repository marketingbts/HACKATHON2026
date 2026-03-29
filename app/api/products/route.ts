import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapProduct } from '@/lib/mappers'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (bizError || !business) {
    return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('business_id', business.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json((data ?? []).map(mapProduct))
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, description, differentiator } = body

  if (!name) {
    return NextResponse.json({ error: 'El campo name es obligatorio' }, { status: 400 })
  }

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (bizError || !business) {
    return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      business_id: business.id,
      name,
      description: description ?? null,
      differentiator: differentiator ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(mapProduct(data), { status: 201 })
}
