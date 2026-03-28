import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-all duration-150 outline-none',
  {
    variants: {
      variant: {
        primary: [
          'w-full sm:w-auto',
          'gap-2 rounded-md px-4 py-3',
          'bg-brand font-bold text-base leading-7 text-surface-muted',
          'hover:brightness-110 active:brightness-95',
          'focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2',
        ],
        secondary: [
          'w-full sm:w-auto',
          'gap-2 rounded-md px-4 py-3',
          'bg-surface-white border border-border-subtle font-bold text-base leading-7 text-brand',
          'hover:bg-surface-primary-subtle hover:border-border-primary',
          'active:bg-surface-primary-faded',
          'focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2',
        ],
        ghost: [
          'w-full sm:w-auto',
          'gap-2 rounded-md px-4 py-3',
          'font-bold text-base leading-7 text-neutral-ui-dark opacity-60 cursor-not-allowed',
        ],
        outline: [
          'w-full sm:w-auto',
          'gap-2 rounded-md px-4 py-3',
          'border border-border-subtle font-bold text-base leading-7 text-brand',
          'hover:bg-surface-primary-subtle hover:border-border-primary',
          'active:bg-surface-primary-faded',
          'focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2',
        ],
        link: [
          'gap-1.5 rounded-md px-3 py-2',
          'font-semibold text-sm text-brand-300',
          'hover:text-brand',
          'active:opacity-70',
          'focus-visible:ring-2 focus-visible:ring-brand-300/40 focus-visible:ring-offset-1',
        ],
        'card-primary': [
          'w-full',
          'rounded-full px-5 py-3',
          'bg-brand-350 font-bold text-2xs text-surface-background tracking-wider uppercase',
          'hover:brightness-105 active:brightness-95',
          'focus-visible:ring-2 focus-visible:ring-brand-350/40 focus-visible:ring-offset-2',
        ],
        'card-secondary': [
          'w-full',
          'rounded-full px-5 py-3',
          'bg-surface-primary-light font-bold text-2xs text-brand-600 tracking-wider uppercase',
          'hover:bg-surface-primary-faded',
          'active:bg-surface-primary-wash',
          'focus-visible:ring-2 focus-visible:ring-brand-600/30 focus-visible:ring-offset-2',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
)

type CardVariant = 'card-primary' | 'card-secondary'

type BaseButtonProps = {
  className?: string
  children: React.ReactNode
} & VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement>

type WithIcons = BaseButtonProps & {
  variant?: Exclude<BaseButtonProps['variant'], CardVariant>
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
}

type WithoutIcons = BaseButtonProps & {
  variant: CardVariant
  iconLeft?: never
  iconRight?: never
}

type ButtonProps = WithIcons | WithoutIcons

export function Button({
  variant = 'primary',
  iconLeft,
  iconRight,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isGhost = variant === 'ghost'
  const isCard = variant === 'card-primary' || variant === 'card-secondary'
  const isLinkVariant = variant === 'link'

  return (
    <button
      type="button"
      disabled={isGhost || disabled}
      aria-disabled={isGhost || disabled ? 'true' : undefined}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      {!isCard && iconLeft && (
        <span aria-hidden="true" className="h-4 w-4 shrink-0">
          {iconLeft}
        </span>
      )}
      <span>{children}</span>
      {!isCard && iconRight && (
        <span
          aria-hidden="true"
          className={isLinkVariant ? 'h-3.5 w-3.5 shrink-0' : 'h-4 w-4 shrink-0'}
        >
          {iconRight}
        </span>
      )}
    </button>
  )
}
