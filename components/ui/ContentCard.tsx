'use client'

import { useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { useImageGeneration } from '@/lib/hooks/use-image-generation'

type ContentCardProps = {
  image?: string
  imageAlt?: string
  copy?: string
  description?: string
  date: string
  dateTime?: string
  title: string
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
  copy: _copy,
  description,
  date,
  dateTime,
  title,
  socialNetwork,
  format,
  recommended = false,
  onViewMore,
  onEdit,
  onNext,
  onPrev,
  className,
}: ContentCardProps) {
  const { imageUrl, loading, generateImage } = useImageGeneration()

  const handleDownloadImage = useCallback(() => {
    if (!imageUrl) return

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'marki-image'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [imageUrl, title])

  // Genera la imagen automáticamente cuando el componente monta
  useEffect(() => {
    if (description) {
      generateImage(description)
    }
  }, [description, generateImage])

  return (
    <article
      className={cn(
        'group relative flex w-full flex-col overflow-hidden',
        'bg-surface-white border border-border-subtle rounded-2xl shadow-sm',
        'transition-all duration-200 hover:shadow-md hover:border-brand-200',
        'h-full',
        className,
      )}
    >
      {/* Imagen generada por HF */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
        {(loading && !image) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-50">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-400 border-t-transparent" />
            <span className="text-[10px] text-neutral-400">Generando imagen…</span>
          </div>
        )}

        {(imageUrl || image) && (
          <>
            <img
              src={imageUrl || image}
              alt={imageAlt || description || title}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                loading && imageUrl ? "opacity-50" : "opacity-100"
              )}
            />
            <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDownloadImage()
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/60 bg-white/82 text-neutral-800 shadow-md backdrop-blur-sm transition hover:bg-white"
                aria-label="Descargar imagen"
                title="Descargar imagen"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v11" />
                  <path d="M7 11l5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Flechas de navegación */}
        {(onPrev || onNext) && (
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 justify-between px-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:scale-100 group-focus-within:opacity-100 scale-95">
            <button
              onClick={(e) => { e.stopPropagation(); onPrev?.() }}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white focus-visible:bg-white"
              aria-label="Anterior variante"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext?.() }}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/90 text-neutral-900 shadow-lg transition hover:bg-white focus-visible:bg-white"
              aria-label="Siguiente variante"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
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
            Ver mas
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
