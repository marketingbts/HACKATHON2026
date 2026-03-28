import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapBusiness, mapAudience, mapProduct } from '@/lib/mappers'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', session.userId)
    .single()

  if (error || !business) {
    return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 404 })
  }

  const [{ data: audiences }, { data: products }] = await Promise.all([
    supabase.from('audiences').select('*').eq('business_id', business.id),
    supabase.from('products').select('*').eq('business_id', business.id),
  ])

  return NextResponse.json({
    ...mapBusiness(business),
    audiences: (audiences ?? []).map(mapAudience),
    products: (products ?? []).map(mapProduct),
  })
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, industry, description, colors, logoUrl, typography, socialNetworks } = body

  if (!name || !industry || !description) {
    return NextResponse.json({ error: 'Faltan campos obligatorios: name, industry, description' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      user_id: session.userId,
      name,
      industry,
      description,
      colors: colors ?? null,
      logo_url: logoUrl ?? null,
      typography: typography ?? null,
      social_networks: socialNetworks ?? [],
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Ya existe un negocio para este usuario' }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ...mapBusiness(data), audiences: [], products: [] }, { status: 201 })
}

export async function PUT(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, industry, description, colors, logoUrl, typography, socialNetworks } = body

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (name !== undefined)           updates.name = name
  if (industry !== undefined)       updates.industry = industry
  if (description !== undefined)    updates.description = description
  if (colors !== undefined)         updates.colors = colors
  if (logoUrl !== undefined)        updates.logo_url = logoUrl
  if (typography !== undefined)     updates.typography = typography
  if (socialNetworks !== undefined) updates.social_networks = socialNetworks

  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('user_id', session.userId)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'No se pudo actualizar el negocio' }, { status: 500 })
  }

  const [{ data: audiences }, { data: products }] = await Promise.all([
    supabase.from('audiences').select('*').eq('business_id', data.id),
    supabase.from('products').select('*').eq('business_id', data.id),
  ])

  return NextResponse.json({
    ...mapBusiness(data),
    audiences: (audiences ?? []).map(mapAudience),
    products: (products ?? []).map(mapProduct),
  })
}
