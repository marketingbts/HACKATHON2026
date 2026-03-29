import Link from 'next/link'

export default function RegistroPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Creá tu cuenta</h2>
      <form className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded font-medium"
        >
          Crear cuenta
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        ¿Ya tenés cuenta?{' '}
        <Link href="/login" className="underline">
          Iniciá sesión
        </Link>
      </p>
    </div>
  )
}
