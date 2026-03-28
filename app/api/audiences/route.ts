import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapAudience } from '@/lib/mappers'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, description, ageRange, interests, behavior, networks, location } = body

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
    .from('audiences')
    .insert({
      business_id: business.id,
      name,
      description: description ?? null,
      age_range: ageRange ?? null,
      interests: interests ?? null,
      behavior: behavior ?? null,
      networks: networks ?? [],
      location: location ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(mapAudience(data), { status: 201 })
}
