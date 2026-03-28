import Link from 'next/link'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/generate', label: 'Generación rápida' },
  { href: '/plans', label: 'Mis planes' },
  { href: '/calendar', label: 'Calendario' },
  { href: '/settings', label: 'Configuración' },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          Marki
        </Link>
        <div className="flex gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  )
}
