'use client'

import { usePathname } from 'next/navigation'
import { NavItem } from './NavItem'

function DashboardIcon() {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <rect x="1" y="1" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="11" width="6" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="1" width="6" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <rect x="11" y="8" width="6" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function BoltIcon() {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path
        d="M10.5 1.5L2 11h7l-1.5 7.5L16 9h-7l1.5-7.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <rect x="1" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 8h16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1v4M12 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ListIcon() {
  return (
    <svg aria-hidden="true" width="18" height="20" viewBox="0 0 18 20" fill="none">
      <path d="M7 5h10M7 10h10M7 15h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="2.5" cy="5" r="1.5" fill="currentColor" />
      <circle cx="2.5" cy="10" r="1.5" fill="currentColor" />
      <circle cx="2.5" cy="15" r="1.5" fill="currentColor" />
    </svg>
  )
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { id: 'fast-create', label: 'Generación Rápida', href: '/generate', icon: <BoltIcon /> },
  { id: 'content-plan', label: 'Plan de Contenido', href: '/plans/new', icon: <CalendarIcon /> },
  { id: 'my-plans', label: 'Mi historial', href: '/history', icon: <ListIcon /> },
] as const

export function SideNavBar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 left-0 w-60 h-screen flex flex-col bg-surface-background border-r border-border-subtle z-40">
      {/* Logo */}
      <div className="p-8 flex flex-col gap-0.5">
        <span className="font-black text-2xl text-brand-600 tracking-[-0.6px] leading-none">
          Marki
        </span>
        <span className="font-medium text-[10px] text-neutral-400 tracking-[2px] uppercase leading-snug">
          Content Strategy
        </span>
      </div>

      {/* Nav links */}
      <nav className="px-4 flex flex-col gap-2" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
          return (
            <NavItem
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={active}
            />
          )
        })}
      </nav>
    </aside>
  )
}
