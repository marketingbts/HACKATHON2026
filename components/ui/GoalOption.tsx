import { cn } from '@/lib/utils'

type GoalOptionProps = {
  name: string
  value: string
  title: string
  description: string
  icon: React.ReactNode
  checked?: boolean
  onChange?: (value: string) => void
}

export function GoalOption({
  name,
  value,
  title,
  description,
  icon,
  checked = false,
  onChange,
}: GoalOptionProps) {
  return (
    <label
      className={cn(
        'flex w-full cursor-pointer items-center gap-3 rounded-lg p-[17px]',
        'transition-colors duration-150',
        checked
          ? 'border border-border-primary bg-surface-light'
          : 'border border-border-subtle bg-surface-background hover:border-border-primary hover:bg-surface-light/50',
      )}
    >
      {/* Ícono círculo 40×40 */}
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-semantic-success-surface"
      >
        {icon}
      </span>

      {/* Texto */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="font-bold text-sm text-neutral-950">{title}</span>
        <span className="font-normal text-xs text-neutral-500">{description}</span>
      </div>

      {/* Radio button visual — derecha */}
      <span
        aria-hidden="true"
        className={cn(
          'ml-auto flex shrink-0 items-center justify-center rounded-full',
          'transition-all duration-150',
          checked
            ? 'h-[22px] w-[22px] bg-brand-600'
            : 'h-5 w-5 border border-neutral-300 bg-surface-background',
        )}
      >
        {/* Punto blanco interior — aparece con escala */}
        <span
          className={cn(
            'h-2 w-2 rounded-full bg-white',
            'transition-transform duration-150',
            checked ? 'scale-100' : 'scale-0',
          )}
        />
      </span>

      {/* Input nativo accesible (oculto) */}
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange?.(value)}
        className="sr-only"
      />
    </label>
  )
}
