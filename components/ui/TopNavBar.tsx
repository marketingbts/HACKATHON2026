'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import { cn } from '@/lib/utils'
import { logoutAction } from '@/app/(auth)/actions'

type TopNavBarProps = {
  greeting: string
  initials: string
  className?: string
}

export function TopNavBar({ greeting, initials, className }: TopNavBarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-60 right-0 h-[60px] px-6',
        'flex items-center justify-between',
        'bg-utility-overlay-white-80 backdrop-blur-[6px]',
        'shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]',
        'z-30',
        className,
      )}
    >
      <p className="text-sm font-semibold text-neutral-900 tracking-[0.7px] uppercase m-0">
        {greeting}
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/settings"
          aria-label="Ajustes"
          className="w-5 h-5 flex items-center justify-center text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
        >
          <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
        </Link>

        <div ref={ref} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú de perfil"
            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-surface-primary-ghost border border-brand text-xs font-semibold text-brand cursor-pointer"
          >
            {initials}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border-subtle overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wide">Mi cuenta</p>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <LogoutOutlinedIcon sx={{ fontSize: 16 }} />
                  Cerrar sesión
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
