import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { MOCK_GENERATE_PLAN } from '@/lib/mock-data'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await req.json() // body disponible para cuando se implemente la IA real

  // TODO: llamar a generateContent() con buildPlanPrompt()
  // y parsear la respuesta JSON de la IA

  // Simular delay de IA (más largo que quick)
  await new Promise((r) => setTimeout(r, 1200))

  return NextResponse.json(MOCK_GENERATE_PLAN)
}
