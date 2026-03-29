'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={modalRef}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-2xl bg-surface-white shadow-xl transition-all flex flex-col max-h-[90vh]",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle p-5">
          <h3 className="text-lg font-bold text-neutral-950">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-border-subtle p-5 bg-neutral-50/50 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}