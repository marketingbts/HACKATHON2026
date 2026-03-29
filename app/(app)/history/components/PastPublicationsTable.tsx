'use client'

import { useState } from 'react'
import { SocialIcon } from './SocialIcon'
import type { CalendarEntry } from '@/lib/types'

const PAGE_SIZE = 5

const FORMAT_LABEL: Record<string, string> = {
  post: 'Publicación',
  reel: 'Reel',
  carrusel: 'Carrusel',
  carousel: 'Carrusel',
  historia: 'Historia',
  story: 'Historia',
}

function formatDateRow(dateStr: string | null) {
  if (!dateStr) return { day: '—', time: '' }
  const d = new Date(dateStr)
  const day = d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
  const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  return { day, time }
}

type PastPublicationsTableProps = {
  entries: CalendarEntry[]
}

export function PastPublicationsTable({ entries }: PastPublicationsTableProps) {
  const [page, setPage] = useState(1)
  const visible = entries.slice(0, page * PAGE_SIZE)
  const hasMore = visible.length < entries.length

  if (entries.length === 0) {
    return (
      <p className="text-sm text-neutral-400 py-6 text-center">
        No hay publicaciones pasadas todavía.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {/* Header de tabla */}
      <div className="grid grid-cols-4 px-4 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider border-b border-border-subtle">
        <span>Fecha</span>
        <span>Origen</span>
        <span>Tipo</span>
        <span>Red social</span>
      </div>

      {/* Filas */}
      {visible.map((entry, i) => {
        const { day, time } = formatDateRow(entry.date)
        return (
          <div
            key={entry.postId}
            className="grid grid-cols-4 px-4 py-3.5 items-center border-b border-border-subtle last:border-0"
          >
            {/* Fecha */}
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-neutral-900">{day}</span>
              {time && <span className="text-xs text-neutral-400">{time}</span>}
            </div>

            {/* Origen */}
            <span className="text-sm text-neutral-700 truncate pr-2">
              {entry.planObjective ?? '—'}
            </span>

            {/* Tipo */}
            <span className="inline-flex">
              <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">
                {FORMAT_LABEL[entry.format?.toLowerCase() ?? ''] ?? entry.format ?? '—'}
              </span>
            </span>

            {/* Red social */}
            {entry.network ? (
              <SocialIcon network={entry.network} showLabel size="sm" />
            ) : (
              <span className="text-sm text-neutral-400">—</span>
            )}
          </div>
        )
      })}

      {/* Ver más */}
      {hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="mt-4 w-full bg-brand text-surface-muted font-bold py-3 rounded-xl text-sm transition-all hover:brightness-110"
        >
          VER MÁS
        </button>
      )}
    </div>
  )
}
