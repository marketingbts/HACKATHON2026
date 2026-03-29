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
  onNext?: () => void
  onPrev?: () => void
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
  onNext,
  onPrev,
  className,
}: ContentCardProps) {
  return (
    <article
      className={cn(
        'relative flex w-full flex-col overflow-hidden',
        'bg-surface-white border border-border-subtle rounded-2xl shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:border-brand-200',
        'h-full',
        className,
      )}
    >
      {/* Imagen portada */}
      <div className="relative aspect-[16/10] w-full overflow-hidden group">
        <img
          src={image}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Flechas de navegación */}
        {(onPrev || onNext) && (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev?.(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md transition-all hover:bg-white/50 hover:scale-110 active:scale-95 shadow-md border border-white/20"
              aria-label="Anterior variante"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext?.(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md transition-all hover:bg-white/50 hover:scale-110 active:scale-95 shadow-md border border-white/20"
              aria-label="Siguiente variante"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5 pr-10">
          {socialNetwork && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-sm shadow-sm text-[9px] font-bold text-brand-700 uppercase tracking-tight">
              {socialNetwork}
            </span>
          )}
          {format && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-600 text-white shadow-sm text-[9px] font-bold uppercase tracking-tight">
              {format}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <time
          dateTime={dateTime}
          className="block font-bold text-[9px] text-neutral-400 tracking-widest uppercase mb-2"
        >
          {date}
        </time>

        <h3 className="font-bold text-sm text-neutral-900 leading-snug mb-2 line-clamp-3 overflow-hidden min-h-[3em]">
          {title}
        </h3>

        <p className="font-normal text-[11px] text-neutral-500 leading-relaxed mb-6 line-clamp-3 overflow-hidden min-h-[4.2em]">
          {description}
        </p>

        {/* Footer acciones */}
        <div className="mt-auto flex gap-2">
          <Button 
            variant="card-primary" 
            onClick={onViewMore}
            className="flex-1 py-2 text-[10px] rounded-xl normal-case tracking-normal h-9"
          >
            Ver más
          </Button>
          <Button 
            variant="card-secondary" 
            onClick={onEdit}
            className="flex-1 py-2 text-[10px] rounded-xl border border-border-subtle bg-surface-muted normal-case tracking-normal h-9"
          >
            Editar
          </Button>
        </div>
      </div>

      {recommended && <RecommendedBadge />}
    </article>
  )
}
