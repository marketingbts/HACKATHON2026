import type { CalendarResponse } from '@/lib/types'

async function getCalendar(): Promise<CalendarResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/calendar`,
    { cache: 'no-store' }
  )
  return res.json()
}

export default async function CalendarPage() {
  const { entries } = await getCalendar()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Calendario unificado</h1>
      <p className="text-gray-500 mb-6">Todos tus planes activos en un solo lugar.</p>

      {entries.length === 0 ? (
        <div className="bg-white border rounded-lg p-12 text-center text-gray-500">
          No hay publicaciones planificadas. Creá un plan para empezar.
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Día</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Acción</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {entries.map((entry) => (
                <tr key={entry.postId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{entry.date}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate">{entry.copy}</p>
                    {entry.imageSuggestion && (
                      <p className="text-xs text-gray-400 italic truncate mt-0.5">
                        📷 {entry.imageSuggestion}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      {entry.network} · {entry.format}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{entry.planObjective}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
