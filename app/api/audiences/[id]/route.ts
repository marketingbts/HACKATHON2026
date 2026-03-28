import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapAudience } from '@/lib/mappers'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, description, ageRange, interests, behavior, networks, location } = body

  const updates: Record<string, unknown> = {}
  if (name !== undefined)        updates.name = name
  if (description !== undefined) updates.description = description
  if (ageRange !== undefined)    updates.age_range = ageRange
  if (interests !== undefined)   updates.interests = interests
  if (behavior !== undefined)    updates.behavior = behavior
  if (networks !== undefined)    updates.networks = networks
  if (location !== undefined)    updates.location = location

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('audiences')
    .update(updates)
    .eq('id', params.id)
    .eq('business_id', business.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Audiencia no encontrada' }, { status: 404 })
  }

  return NextResponse.json(mapAudience(data))
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { error } = await supabase
    .from('audiences')
    .delete()
    .eq('id', params.id)
    .eq('business_id', business.id)

  if (error) {
    return NextResponse.json({ error: 'No se pudo eliminar la audiencia' }, { status: 500 })
  }

  return NextResponse.json({ deleted: params.id })
}
