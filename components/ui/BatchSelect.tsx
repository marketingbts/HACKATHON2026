import { cn } from '@/lib/utils'

type Option = { value: string; label: string; icon?: React.ReactNode }

type BatchSelectProps = {
  label: string
  options: Option[]
  value: string[]
  onChange: (values: string[]) => void
  wrapperClassName?: string
}

export function BatchSelect({ label, options, value, onChange, wrapperClassName }: BatchSelectProps) {
  function toggle(optionValue: string) {
    const next = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(next)
  }

  return (
    <div className={cn('flex w-full flex-col items-start gap-2', wrapperClassName)}>
      <span className="font-medium text-sm text-neutral-ui-label">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value.includes(option.value)
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm font-medium border transition-colors duration-150 flex items-center gap-1.5',
                selected
                  ? 'bg-brand border-brand text-surface-muted'
                  : 'bg-surface-input border-border-input text-neutral-950 hover:border-border-primary',
              )}
            >
              {option.icon && <span className="w-4 h-4 shrink-0">{option.icon}</span>}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
