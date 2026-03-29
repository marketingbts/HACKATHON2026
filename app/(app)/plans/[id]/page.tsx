import type { ContentPlanResponse } from '@/lib/types'
import { PlanDetailClient } from './PlanDetailClient'

async function getPlan(id: string): Promise<ContentPlanResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/plans/${id}`,
    { cache: 'no-store' }
  )
  return res.json()
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const plan = await getPlan(params.id)

  return <PlanDetailClient plan={plan} />
}
