import Link from 'next/link'
import type { ContentPlanResponse } from '@/lib/types'

async function getPlan(id: string): Promise<ContentPlanResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/plans/${id}`,
    { cache: 'no-store' }
  )
  return res.json()
}

export default async function PlanDetailPage({ params }: { params: { id: string } }) {
  const plan = await getPlan(params.id)

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Link href="/history" className="text-sm text-gray-500 hover:underline">
          ← Mi historial
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6 mt-3">
        <div>
          <h1 className="text-2xl font-bold">{plan.objective}</h1>
          <p className="text-gray-500 text-sm">
            {plan.periodStart} → {plan.periodEnd} ·{' '}
            <span className={plan.status === 'active' ? 'text-green-600' : 'text-gray-400'}>
              {plan.status === 'active' ? 'Activo' : 'Archivado'}
            </span>
          </p>
        </div>
        {plan.status === 'active' && (
          <button className="border text-sm px-4 py-1.5 rounded text-gray-500 hover:border-gray-400">
            Archivar
          </button>
        )}
      </div>

      {/* Estrategia */}
      {plan.strategySummary && (
        <div className="bg-white border rounded-lg p-6 mb-4">
          <h2 className="font-semibold mb-2">Resumen de estrategia</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{plan.strategySummary}</p>
        </div>
      )}

      {/* Acciones recomendadas */}
      {plan.recommendedActions.length > 0 && (
        <div className="bg-white border rounded-lg p-6 mb-4">
          <h2 className="font-semibold mb-3">Acciones recomendadas</h2>
          <ul className="flex flex-col gap-2">
            {plan.recommendedActions.map((a: string, i: number) => (
              <li key={i} className="flex gap-2 text-sm">
                <span>→</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Posts */}
      {plan.posts.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-3">Contenido planificado</h2>
          <div className="flex flex-col gap-3">
            {plan.posts.map((post) => (
              <div key={post.id} className="bg-white border rounded-lg p-5">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{post.scheduledDate}</span>
                  <span className="text-xs text-gray-400">
                    {post.network} · {post.format}
                  </span>
                </div>
                <p className="text-sm mb-2">{post.copy}</p>
                {post.imageSuggestion && (
                  <p className="text-xs text-gray-400 italic">📷 {post.imageSuggestion}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.posts.length === 0 && (
        <div className="bg-white border rounded-lg p-6 text-center text-gray-500 text-sm">
          Para este objetivo, la estrategia se basa en acciones directas con tus clientes, no en publicaciones.
        </div>
      )}

      <div className="mt-4">
        <Link href="/calendar" className="text-sm underline text-gray-500">
          Ver calendario unificado →
        </Link>
      </div>
    </div>
  )
}
