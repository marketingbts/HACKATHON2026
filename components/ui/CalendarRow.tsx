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

export function CalendarRow({ date, time, title, contentType, socialNetwork, className }: CalendarRowProps) {
  return (
    <article
      className={cn(
        'flex items-center w-full min-h-[64px] px-6 py-3 gap-6',
        'bg-surface-white hover:bg-neutral-50 transition-colors cursor-default',
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
      <p className="flex-1 text-sm font-medium text-neutral-800 truncate m-0">
        {title}
      </p>

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
