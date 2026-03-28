import { cn } from '@/lib/utils'

type TextareaProps = {
  id: string
  label: string
  rows?: number
  className?: string
  wrapperClassName?: string
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({
  id,
  label,
  rows = 4,
  className,
  wrapperClassName,
  ...props
}: TextareaProps) {
  return (
    <div className={cn('flex w-full flex-col items-start gap-2', wrapperClassName)}>
      <label
        htmlFor={id}
        className="font-medium text-sm text-neutral-ui-label"
      >
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={cn(
          'w-full min-h-textarea px-4 py-3',
          'bg-surface-input border border-border-input rounded-lg',
          'text-sm font-normal text-brand-900',
          'placeholder:text-neutral-ui-placeholder placeholder:font-normal',
          'transition-colors duration-150',
          'hover:border-[#c7c9e0]',
          'resize-none focus:outline-none focus:border-2 focus:border-brand-500',
          className
        )}
        {...props}
      />
    </div>
  )
}
