'use client'

import { toast } from 'sonner'
import { Modal } from './Modal'
import { cn } from '@/lib/utils'

type ContentDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  content: {
    image?: string
    imageAlt?: string
    date: string
    title: string
    description: string
    socialNetwork?: string
    format?: string
  } | null
}

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => toast.success('Copiado al portapapeles'))
  } else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-9999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      toast.success('Copiado al portapapeles')
    } catch (err) {
      console.error('Error al copiar:', err)
    }
    document.body.removeChild(textArea)
  }
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
        {/* Badges */}
        {(content.socialNetwork || content.format) && (
          <div className="flex items-center gap-2">
            {content.socialNetwork && (
              <span className="px-3 py-1 rounded-full font-bold text-[10px] text-brand-700 bg-brand-50 uppercase shadow-sm">
                {content.socialNetwork}
              </span>
            )}
            {content.format && (
              <span className="bg-brand-600 px-3 py-1 rounded-full font-bold text-[10px] text-surface-background uppercase shadow-sm">
                {content.format}
              </span>
            )}
          </div>
        )}

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
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Descripción y Sugerencias
              </span>
              <button
                onClick={() => copyToClipboard(content.description)}
                className="text-neutral-400 hover:text-brand-600 transition-colors"
                aria-label="Copiar descripción"
                type="button"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              </button>
            </div>
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
