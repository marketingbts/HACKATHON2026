import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  ctaLabel?: string
  onCta?: () => void
  className?: string
}

export function EmptyState({ title, description, ctaLabel, onCta, className }: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center gap-4 px-10 py-12 text-center',
        'bg-surface-subtle border border-border-default rounded-xl',
        className,
      )}
    >
      {/* Ícono */}
      <div
        aria-hidden="true"
        className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center bg-surface-primary-muted"
      >
        <span className="text-[28px] leading-none text-brand-500">✦</span>
      </div>

      {/* Copy */}
      <h3 className="text-[18px] font-bold text-brand-900 leading-snug m-0">
        {title}
      </h3>
      <p className="text-sm font-normal text-neutral-ui-muted leading-relaxed m-0">
        {description}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <button
          type="button"
          onClick={onCta}
          className="inline-flex items-center justify-center h-11 px-5 bg-brand-500 text-surface-white rounded-[10px] text-sm font-semibold border-none cursor-pointer transition-colors duration-150 hover:bg-brand-600 active:brightness-95"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
