import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Hola, La Esquina de María 👋</h1>
      <p className="text-gray-500 mb-8">¿Qué querés hacer hoy?</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
        <Link
          href="/generate"
          className="block p-6 bg-white border rounded-lg hover:shadow transition"
        >
          <div className="text-2xl mb-2">⚡</div>
          <h2 className="font-semibold mb-1">Generación rápida</h2>
          <p className="text-sm text-gray-500">Para cuando necesito algo puntual ahora</p>
        </Link>

        <Link
          href="/plans/new"
          className="block p-6 bg-white border rounded-lg hover:shadow transition"
        >
          <div className="text-2xl mb-2">📅</div>
          <h2 className="font-semibold mb-1">Crear plan de contenido</h2>
          <p className="text-sm text-gray-500">Para organizar mis redes por un período</p>
        </Link>

        <Link
          href="/plans"
          className="block p-6 bg-white border rounded-lg hover:shadow transition"
        >
          <div className="text-2xl mb-2">📋</div>
          <h2 className="font-semibold mb-1">Mis planes</h2>
          <p className="text-sm text-gray-500">Ver los planes que ya creé</p>
        </Link>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Próximas publicaciones</h2>
        <div className="bg-white border rounded-lg divide-y">
          <div className="px-4 py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">Post de anticipación</span>
              <span className="text-xs text-gray-400 ml-2">Instagram · post</span>
            </div>
            <span className="text-sm text-gray-500">28 mar</span>
          </div>
          <div className="px-4 py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">Reel de lanzamiento</span>
              <span className="text-xs text-gray-400 ml-2">Instagram · reel</span>
            </div>
            <span className="text-sm text-gray-500">30 mar</span>
          </div>
          <div className="px-4 py-3 text-center">
            <Link href="/calendar" className="text-sm underline text-gray-500">
              Ver calendario completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
