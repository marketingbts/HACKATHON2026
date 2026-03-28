import { cn } from '@/lib/utils'

type TopNavBarProps = {
  greeting: string
  initials: string
  onSettings?: () => void
  className?: string
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.42 1.42M14.36 14.36l1.42 1.42M4.22 15.78l1.42-1.42M14.36 5.64l1.42-1.42"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TopNavBar({ greeting, initials, onSettings, className }: TopNavBarProps) {
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
        <button
          type="button"
          aria-label="Ajustes"
          onClick={onSettings}
          className="w-5 h-5 flex items-center justify-center text-neutral-600 transition-colors duration-150 hover:text-neutral-900"
        >
          <SettingsIcon />
        </button>

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
