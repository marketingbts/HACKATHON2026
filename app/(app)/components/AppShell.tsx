'use client'

import { usePathname } from 'next/navigation'
import { SideNavBar } from '@/components/ui/SideNavBar'
import { TopNavBar } from '@/components/ui/TopNavBar'

type AppShellProps = {
  brandName: string
  children: React.ReactNode
}

export function AppShell({ brandName, children }: AppShellProps) {
  const pathname = usePathname()

  const greeting = (() => {
    if (pathname === '/dashboard') return `¡Buen día, ${brandName}! ☀️`
    if (pathname.startsWith('/plans')) return 'Plan de contenido'
    if (pathname === '/settings') return 'Configuración'
    if (pathname === '/generate') return 'Generación rápida'
    return brandName
  })()

  const initials = brandName.substring(0, 2).toUpperCase()

  return (
    <div className="flex min-h-screen bg-surface-background">
      <SideNavBar />

      <div className="flex-1 flex flex-col pl-60">
        <TopNavBar greeting={greeting} initials={initials} />
        <main className="px-4 sm:px-6 lg:px-10 pt-[80px] pb-16">
          {children}
        </main>
      </div>
    </div>
  )
}
