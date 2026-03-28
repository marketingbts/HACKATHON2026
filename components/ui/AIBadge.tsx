import { cn } from '@/lib/utils'

type AIBadgeProps = {
  label: string
  className?: string
}

export function AIBadge({ label, className }: AIBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5',
        'rounded-pill bg-surface-ai-badge border border-border-primary-subtle',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="font-normal text-[11px] leading-none text-brand-500"
      >
        ✦
      </span>
      <span className="font-semibold text-2xs text-brand-500">{label}</span>
    </div>
  )
}
