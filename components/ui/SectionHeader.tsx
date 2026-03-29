import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  title: string
  subtitle?: string
  level?: 2 | 3
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  level = 2,
  className,
}: SectionHeaderProps) {
  const Heading = level === 2 ? 'h2' : 'h3'

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Heading className="font-bold text-xl leading-7 text-brand-900">
        {title}
      </Heading>
      {subtitle && (
        <p className="font-normal text-sm leading-5 text-neutral-ui-muted">
          {subtitle}
        </p>
      )}
    </div>
  )
}
