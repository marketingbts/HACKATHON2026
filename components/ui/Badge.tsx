import { cn } from '@/lib/utils'

type BadgeProps = {
  label: string
  closeable?: boolean
  onClose?: () => void
  className?: string
}

export function Badge({ label, closeable = false, onClose, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1',
        'rounded-sm bg-surface-primary-wash',
        'font-medium text-2xs text-neutral-900',
        'transition-colors duration-100',
        closeable && 'hover:bg-surface-primary-faded',
        className,
      )}
    >
      {label}
      {closeable && (
        <button
          type="button"
          aria-label={`Eliminar ${label}`}
          onClick={onClose}
          className="leading-none transition-colors duration-100 hover:text-neutral-950 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-500/50 focus-visible:rounded-sm"
        >
          ×
        </button>
      )}
    </span>
  )
}
