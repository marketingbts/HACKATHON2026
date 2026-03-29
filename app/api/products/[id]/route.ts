import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { mapProduct } from '@/lib/mappers'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { name, description, differentiator } = body

  const updates: Record<string, unknown> = {}
  if (name !== undefined)           updates.name = name
  if (description !== undefined)    updates.description = description
  if (differentiator !== undefined) updates.differentiator = differentiator

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .single()

  if (!business) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', params.id)
    .eq('business_id', business.id)
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  }

  return NextResponse.json(mapProduct(data))
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
    .from('products')
    .delete()
    .eq('id', params.id)
    .eq('business_id', business.id)

  if (error) {
    return NextResponse.json({ error: 'No se pudo eliminar el producto' }, { status: 500 })
  }

  return NextResponse.json({ deleted: params.id })
}
