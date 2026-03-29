import { cn } from '@/lib/utils'
import { AIBadge } from './AIBadge'

type MarkiExplainProps = {
  content: string
  className?: string
}

export function MarkiExplain({ content, className }: MarkiExplainProps) {
  return (
    <aside
      aria-label="Explicación de Marki"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-start gap-[10px] p-6',
        'bg-surface-primary-subtle border border-border-subtle rounded-lg',
        'max-w-[910px]',
        className,
      )}
    >
      <AIBadge label="Explicación de Marki" />

      <p className="font-normal text-xs leading-4 text-brand-800 max-w-[800px] whitespace-pre-wrap">
        {content}
      </p>
    </aside>
  )
}
