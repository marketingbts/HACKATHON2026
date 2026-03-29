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
        'flex items-center w-full h-14 px-4 py-3 gap-4',
        'bg-surface-white',
        className,
      )}
    >
      {/* Fecha + hora */}
      <div className="w-[140px] shrink-0 flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-brand-900 leading-none">
          {date}
        </span>
        <span className="text-xs font-normal text-neutral-ui-muted leading-none">
          {time}
        </span>
      </div>

      {/* Título */}
      <p className="w-[160px] shrink-0 text-[13px] font-normal text-brand-900 truncate m-0">
        {title}
      </p>

      {/* Badge tipo de contenido */}
      <Badge label={contentType} />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Badge red social */}
      <Badge label={socialNetwork} />
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
      className="flex flex-col divide-y divide-border-light border border-border-light rounded-sm overflow-hidden"
    >
      {children}
    </section>
  )
}
