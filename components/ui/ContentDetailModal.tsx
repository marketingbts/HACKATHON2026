'use client'

import { Modal } from './Modal'
import { Badge } from './Badge'
import { cn } from '@/lib/utils'

type ContentDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  content: {
    image: string
    imageAlt: string
    date: string
    title: string
    description: string
    socialNetwork?: string
    format?: string
  } | null
}

export function ContentDetailModal({ isOpen, onClose, content }: ContentDetailModalProps) {
  if (!content) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle del Contenido"
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        {/* Portada */}
        <div className="relative h-64 w-full overflow-hidden rounded-xl border border-border-subtle">
          <img
            src={content.image}
            alt={content.imageAlt}
            className="h-full w-full object-cover"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2">
            {content.socialNetwork && (
              <span className="bg-utility-overlay-light backdrop-blur-md px-3 py-1 rounded-full font-bold text-[10px] text-brand-700 uppercase shadow-sm">
                {content.socialNetwork}
              </span>
            )}
            {content.format && (
              <span className="bg-brand-600 backdrop-blur-md px-3 py-1 rounded-full font-bold text-[10px] text-surface-background uppercase shadow-sm">
                {content.format}
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Fecha de publicación
            </span>
            <p className="text-sm font-semibold text-neutral-900">{content.date}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-neutral-950 leading-tight">
              {content.title}
            </h3>
            <div className="h-1 w-12 bg-brand-500 rounded-full" />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Descripción y Sugerencias
            </span>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">
                {content.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}