'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type GeneratedContentCardProps = {
  content: string
  imageHint?: string
  recommended?: boolean
  onRegenerate?: () => void
  onCopy?: (text: string) => void
  onSave?: (text: string) => void
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

function RefreshIcon() {
  return (
    <img src="/assets/icons/refresh.svg" alt="" />
  )
}

function CopyIcon() {
  return (
    <img src="/assets/icons/copy.svg" alt="" />
  )
}

function ImageIcon() {
  return (
    <img src="/assets/icons/edit-copy.svg" alt="" />
  )
}

export function GeneratedContentCard({
  content,
  imageHint,
  recommended = false,
  onRegenerate,
  onCopy,
  onSave,
  className,
}: GeneratedContentCardProps) {
  const [editableContent, setEditableContent] = useState(content)
  const [prevContent, setPrevContent] = useState(content)

  // Sync when parent provides new content (e.g., after regenerate)
  if (prevContent !== content) {
    setPrevContent(content)
    setEditableContent(content)
  }

  return (
    <article
      className={cn(
        'relative flex w-full flex-col gap-3 px-5 py-4',
        'bg-surface-white border border-border-default rounded-xl',
        className,
      )}
    >
      {/* Texto generado — editable */}
      <div className="rounded-lg border border-surface-elevated bg-surface-elevated px-4 py-4 transition-colors duration-150 focus-within:border-border-primary-subtle">
        <textarea
          value={editableContent}
          onChange={(e) => setEditableContent(e.target.value)}
          rows={6}
          className={cn(
            'w-full resize-none bg-transparent',
            'font-normal text-sm leading-[22.75px] text-neutral-700',
            'outline-none placeholder:text-neutral-400',
          )}
        />
      </div>

      {/* Hint IA */}
      {imageHint && (
        <div className="flex items-center gap-3 rounded-md bg-surface-primary-subtle px-3 py-2">
          <span className="shrink-0 text-brand-800">
            <ImageIcon />
          </span>
          <p className="font-medium text-2xs leading-4 text-brand-800">
            {imageHint}
          </p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          aria-label="Regenerar contenido"
          onClick={onRegenerate}
          className={cn(
            'flex items-center gap-[5px] rounded-md px-3 py-2',
            'font-semibold text-2xs text-neutral-600',
            'transition-colors duration-150 hover:text-neutral-900',
          )}
        >
          <RefreshIcon />
          Regenerar
        </button>

        <button
          type="button"
          aria-label="Copiar texto al portapapeles"
          onClick={() => onCopy?.(editableContent)}
          className={cn(
            'flex items-center gap-[5px] rounded-md px-3 py-2',
            'font-semibold text-2xs text-brand-300',
            'transition-colors duration-150 hover:text-brand',
          )}
        >
          <CopyIcon />
          Copiar
        </button>

        <button
          type="button"
          aria-label="Guardar contenido"
          onClick={() => onSave?.(editableContent)}
          className={cn(
            'flex items-center justify-center rounded-md px-3 py-2',
            'bg-gradient-to-r from-[#4648d4] to-[#6063ee]',
            'font-semibold text-2xs text-surface-background',
            'transition-all duration-150 hover:brightness-110 active:brightness-95',
          )}
        >
          Guardar
        </button>
      </div>

      {recommended && <RecommendedBadge />}
    </article>
  )
}
