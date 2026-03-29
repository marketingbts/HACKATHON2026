import { cn } from '@/lib/utils'
import { Badge } from './Badge'

type CalendarRowProps = {
  date: string
  time: string
  title: string
  contentType: string
  socialNetwork: string
  className?: string
}

export function CalendarRow({ 
  date, 
  time, 
  title, 
  contentType, 
  socialNetwork, 
  source,
  onClick,
  className 
}: CalendarRowProps & { source?: 'plan' | 'quick', onClick?: () => void }) {
  return (
    <article
      onClick={onClick}
      className={cn(
        'flex items-center w-full min-h-[64px] px-6 py-3 gap-6',
        'bg-surface-white hover:bg-neutral-50 transition-colors',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
    >
      {/* Fecha + hora */}
      <div className="w-[120px] shrink-0 flex flex-col gap-1">
        <span className="text-[13px] font-bold text-neutral-950 leading-tight">
          {date}
        </span>
        <span className="text-xs font-medium text-neutral-500 leading-tight">
          {time}hs
        </span>
      </div>

      {/* Título */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {source && (
          <Badge 
            label={source === 'plan' ? 'Plan' : 'Rápido'} 
            className={cn(
              "text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded",
              source === 'plan' 
                ? "bg-purple-100 text-purple-700 border border-purple-200" 
                : "bg-blue-100 text-blue-700 border border-blue-200"
            )}
          />
        )}
        <p className="text-sm font-medium text-neutral-800 truncate m-0">
          {title}
        </p>
      </div>

      {/* Badges container */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Badge tipo de contenido */}
        <Badge 
          label={contentType} 
          className="bg-brand-50 text-brand-700 border border-brand-100 font-semibold px-3 py-1 rounded-full text-[11px]"
        />

        {/* Badge red social */}
        <Badge 
          label={socialNetwork} 
          className="bg-pink-50 text-pink-700 border border-pink-100 font-semibold px-3 py-1 rounded-full text-[11px]"
        />
      </div>
    </article>
  )
}

type CalendarListProps = {
  children: React.ReactNode
  'aria-label'?: string
}

export function CalendarList({ children, 'aria-label': ariaLabel }: CalendarListProps) {
  return (
    <section
      aria-label={ariaLabel ?? 'Calendario de contenidos'}
      className="flex flex-col border border-border-subtle rounded-2xl overflow-hidden bg-surface-white"
    >
      <div className="flex flex-col divide-y divide-border-subtle">
        {children}
      </div>
    </section>
  )
}
