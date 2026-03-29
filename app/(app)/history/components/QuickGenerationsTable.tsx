'use client'

import type { QuickGeneration } from '@/lib/types'

type QuickGenerationsTableProps = {
  generations: QuickGeneration[]
}

export function QuickGenerationsTable({ generations }: QuickGenerationsTableProps) {
  if (generations.length === 0) {
    return (
      <div className="border border-border-subtle rounded-2xl p-10 text-center text-neutral-400 text-sm bg-white">
        No hay generaciones rápidas para mostrar.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border-subtle bg-white">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-subtle bg-neutral-50/50">
            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Fecha</th>
            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Formato</th>
            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Contenido (Copy)</th>
            <th className="px-6 py-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {generations.map((gen) => (
            <tr key={gen.id} className="hover:bg-neutral-50/50 transition-colors">
              <td className="px-6 py-4 text-xs text-neutral-500 whitespace-nowrap">
                {new Date(gen.createdAt).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 uppercase">
                  {gen.format}
                </span>
              </td>
              <td className="px-6 py-4 min-w-[300px]">
                <p className="text-xs text-neutral-700 line-clamp-2 leading-relaxed">
                  {gen.copy}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                  onClick={() => navigator.clipboard.writeText(gen.copy ?? '')}
                  className="text-xs font-bold text-brand disabled:opacity-50 disabled:cursor-not-allowed hover:text-brand-700 transition-colors"
                  disabled={!gen.copy}
                >
                  Copiar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}