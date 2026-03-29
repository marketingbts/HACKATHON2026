import { cn } from '@/lib/utils'

type InputFieldProps = {
  id: string
  label: string
  className?: string
  wrapperClassName?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export function InputField({
  id,
  label,
  className,
  wrapperClassName,
  ...props
}: InputFieldProps) {
  return (
    <div className={cn('flex w-full flex-col items-start gap-2', wrapperClassName)}>
      <label
        htmlFor={id}
        className="font-medium text-sm text-neutral-ui-label"
      >
        {label}
      </label>
      <input
        id={id}
        className={cn(
          'w-full h-input px-4 py-3.5',
          'bg-surface-input border border-border-input rounded-lg',
          'text-sm font-normal text-brand-900',
          'placeholder:text-neutral-ui-placeholder placeholder:font-normal',
          'transition-colors duration-150',
          'hover:border-[#c7c9e0]',
          'focus:outline-none focus:border-2 focus:border-brand-500',
          className
        )}
        {...props}
      />
    </div>
  )
}
