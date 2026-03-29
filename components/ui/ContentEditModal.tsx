'use client'

import { Modal } from './Modal'
import { Button } from './Button'
import { useState, useEffect } from 'react'

type ContentEditModalProps = {
  isOpen: boolean
  onClose: () => void
  initialCopy: string
  onSave: (newCopy: string) => void
}

export function ContentEditModal({ isOpen, onClose, initialCopy, onSave }: ContentEditModalProps) {
  const [copy, setCopy] = useState(initialCopy)

  useEffect(() => {
    setCopy(initialCopy)
  }, [initialCopy])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editor de Contenido"
      className="max-w-xl"
      footer={
        <div className="flex justify-end gap-2 w-full">
          <Button variant="outline" onClick={onClose} className="px-6 h-10 text-xs">
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => { onSave(copy); onClose(); }} className="px-6 h-10 text-xs">
            Guardar Cambios
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
            Texto de la publicación
          </label>
          <textarea
            className="w-full min-h-[250px] p-4 text-sm border border-border-subtle rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-neutral-50 shadow-inner leading-relaxed transition-all resize-none outline-none"
            value={copy}
            onChange={(e) => setCopy(e.target.value)}
            placeholder="Escribe el contenido aquí..."
            autoFocus
          />
        </div>
        <p className="text-[10px] text-neutral-400 italic">
          Tip: Edita el texto para que se adapte perfectamente a tu marca antes de guardar el plan.
        </p>
      </div>
    </Modal>
  )
}