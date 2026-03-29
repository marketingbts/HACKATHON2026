import { cn } from '@/lib/utils'

type QuickActionVariant = 'fast-create' | 'create-plan' | 'view-plans'

type QuickActionProps = {
  variant: QuickActionVariant
  title: string
  description: string
  ctaLabel: string
  icon: React.ReactNode
  onCtaClick?: () => void
  className?: string
}

const variantStyles: Record<QuickActionVariant, { iconBg: string; ctaColor: string }> = {
  'fast-create': {
    iconBg:   'bg-surface-primary-subtle',
    ctaColor: 'text-brand-300',
  },
  'create-plan': {
    iconBg:   'bg-semantic-success-surface',
    ctaColor: 'text-semantic-success-dark',
  },
  'view-plans': {
    iconBg:   'bg-semantic-info-surface',
    ctaColor: 'text-neutral-550',
  },
}

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="shrink-0 transition-transform duration-200 group-hover/cta:translate-x-1"
    >
      <path
        d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function QuickAction({
  variant,
  title,
  description,
  ctaLabel,
  icon,
  onCtaClick,
  className,
}: QuickActionProps) {
  const { iconBg, ctaColor } = variantStyles[variant]

  return (
    <article
      onClick={onCtaClick}
      className={cn(
        'group flex w-full flex-col items-start rounded-lg',
        'border border-border-muted bg-surface-background',
        'p-6 gap-4.5',
        // Hover: lift + border highlight + deeper shadow
        'transition-all duration-200 ease-out cursor-pointer',
        'hover:-translate-y-1 hover:border-border-primary',
        'hover:shadow-[0_8px_24px_rgba(70,72,212,0.12)]',
        'active:translate-y-0 active:shadow-[0_2px_8px_rgba(70,72,212,0.08)]',
        'sm:w-quick-action',
        className,
      )}
    >
      {/* Icon container — scales up on card hover */}
      <div
        aria-hidden="true"
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-lg',
          'transition-transform duration-200 group-hover:scale-110',
          iconBg,
        )}
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="font-bold text-[18px] leading-7 text-neutral-900">
        {title}
      </h3>

      {/* Description */}
      <p className="font-normal text-sm leading-[22.75px] text-neutral-ui-dark">
        {description}
      </p>

      {/* CTA */}
      <button
        type="button"
        onClick={onCtaClick}
        className={cn(
          'group/cta flex items-center gap-1.5 rounded-md py-2',
          'font-semibold text-sm transition-all duration-150',
          'active:opacity-70',
          ctaColor,
        )}
      >
        {ctaLabel}
        <ArrowRight />
      </button>
    </article>
  )
}
