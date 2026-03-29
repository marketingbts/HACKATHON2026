import Link from 'next/link'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import { cn } from '@/lib/utils'

type TopNavBarProps = {
  greeting: string
  initials: string
  className?: string
}

export function TopNavBar({ greeting, initials, className }: TopNavBarProps) {
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

        <div
          aria-hidden="true"
          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-surface-primary-ghost border border-brand text-xs font-semibold text-brand"
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
