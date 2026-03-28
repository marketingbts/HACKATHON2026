import { cn } from '@/lib/utils'
import { Button } from './Button'

type ContentCardProps = {
  image: string
  imageAlt: string
  date: string
  dateTime?: string
  title: string
  description: string
  socialNetwork?: string
  format?: string
  recommended?: boolean
  onViewMore?: () => void
  onEdit?: () => void
  className?: string
}

function RecommendedBadge() {
  return (
    <div
      aria-label="Contenido recomendado"
      className="absolute top-[10px] right-[-1px] bg-brand-400 rounded-bl-[6px] px-1.5 py-px"
    >
      <span className="font-bold text-[7px] leading-none tracking-wide text-surface-background uppercase">
        Recomendado
      </span>
    </div>
  )
}

export function ContentCard({
  image,
  imageAlt,
  date,
  dateTime,
  title,
  description,
  socialNetwork,
  format,
  recommended = false,
  onViewMore,
  onEdit,
  className,
}: ContentCardProps) {
  return (
    <article
      className={cn(
        'relative w-full overflow-hidden p-px',
        'bg-surface-background border border-utility-black rounded-xl',
        'sm:w-[309px]',
        className,
      )}
    >
      {/* Imagen portada */}
      <div className="relative h-card-image w-full overflow-hidden rounded-t-[calc(theme(borderRadius.xl)-1px)]">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover"
        />

        {/* Overlay badges */}
        {(socialNetwork || format) && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {socialNetwork && (
              <span
                className={cn(
                  'flex h-[18px] items-center px-2 rounded-full',
                  'bg-utility-overlay-light backdrop-blur-[6px]',
                  'shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
                  'font-bold text-[7px] leading-none tracking-wide text-brand-700 uppercase',
                )}
              >
                {socialNetwork}
              </span>
            )}
            {format && (
              <span
                className={cn(
                  'flex h-[18px] items-center px-2 rounded-full',
                  'bg-brand-600 backdrop-blur-[6px]',
                  'shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
                  'font-bold text-[7px] leading-none tracking-wide text-surface-background uppercase',
                )}
              >
                {format}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col items-start p-6">
        <time
          dateTime={dateTime}
          className="font-bold text-3xs text-neutral-400 tracking-wider uppercase pb-2"
        >
          {date}
        </time>

        <h3 className="font-bold text-base text-neutral-900 leading-6 pb-3">
          {title}
        </h3>

        <p className="font-normal text-2xs text-neutral-500 leading-[19.5px] pb-6">
          {description}
        </p>

        {/* Footer acciones */}
        <div className="flex w-full flex-col gap-2">
          <Button variant="card-primary" onClick={onViewMore}>
            Ver más
          </Button>
          <Button variant="card-secondary" onClick={onEdit}>
            Editar pieza
          </Button>
        </div>
      </div>

      {recommended && <RecommendedBadge />}
    </article>
  )
}
