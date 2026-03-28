import Link from 'next/link'

async function getPlans() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/plans`, {
    cache: 'no-store',
  })
  return res.json()
}

export default async function PlansPage() {
  const plans = await getPlans()

  const active = plans.filter((p: { status: string }) => p.status === 'active')
  const archived = plans.filter((p: { status: string }) => p.status === 'archived')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis planes</h1>
        <Link href="/plans/new" className="bg-black text-white px-4 py-2 rounded text-sm">
          + Nuevo plan
        </Link>
      </div>

      {active.length === 0 && archived.length === 0 && (
        <div className="text-center py-16 bg-white border rounded-lg">
          <p className="text-gray-500 mb-4">Todavía no creaste ningún plan. ¿Empezamos?</p>
          <Link href="/plans/new" className="bg-black text-white px-6 py-2 rounded text-sm">
            Crear mi primer plan
          </Link>
        </div>
      )}

      {active.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold mb-3 text-gray-700">Activos</h2>
          <div className="flex flex-col gap-3">
            {active.map((plan: { id: string; objective: string; periodStart: string; periodEnd: string }) => (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="bg-white border rounded-lg p-4 flex justify-between items-center hover:shadow transition"
              >
                <div>
                  <p className="font-medium">{plan.objective}</p>
                  <p className="text-sm text-gray-500">
                    {plan.periodStart} → {plan.periodEnd}
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  Activo
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {archived.length > 0 && (
        <section>
          <h2 className="font-semibold mb-3 text-gray-400">Archivados</h2>
          <div className="flex flex-col gap-3">
            {archived.map((plan: { id: string; objective: string; periodStart: string; periodEnd: string }) => (
              <Link
                key={plan.id}
                href={`/plans/${plan.id}`}
                className="bg-white border rounded-lg p-4 flex justify-between items-center opacity-60 hover:opacity-80 transition"
              >
                <div>
                  <p className="font-medium">{plan.objective}</p>
                  <p className="text-sm text-gray-500">
                    {plan.periodStart} → {plan.periodEnd}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  Archivado
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
