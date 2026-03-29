'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { PlanCard } from './PlanCard'
import { PastPublicationsTable } from './PastPublicationsTable'
import { QuickGenerationsTable } from './QuickGenerationsTable'
import type { ContentPlan, CalendarEntry, QuickGeneration } from '@/lib/types'
import { cn } from '@/lib/utils'

type HistorialClientProps = {
  plans: ContentPlan[]
  calendarEntries: CalendarEntry[]
  quickGenerations: QuickGeneration[]
}

const today = new Date().toISOString().split('T')[0]

export function HistorialClient({ plans, calendarEntries, quickGenerations }: HistorialClientProps) {
  const [activeTab, setActiveTab] = useState<'planes' | 'generaciones'>('planes')

  const activePlansCount = plans.filter((p) => p.status === 'active').length

  // Derivar redes y progreso por plan desde el calendario
  function getPlanMeta(planId: string) {
    const entries = calendarEntries.filter((e) => e.planId === planId)
    const networks = Array.from(new Set(entries.map((e) => e.network).filter(Boolean))) as string[]
    const totalPosts = entries.length
    const publishedPosts = entries.filter((e) => e.date && e.date <= today).length
    return { networks, totalPosts, publishedPosts }
  }

  // Publicaciones pasadas (fecha <= hoy)
  const pastEntries = calendarEntries
    .filter((e) => e.date && e.date <= today)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

  const tabs = [
    {
      key: 'planes' as const,
      label: 'Planes de contenido',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      ),
    },
    {
      key: 'generaciones' as const,
      label: 'Generaciones Rápidas',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-950">Historial</h1>
        <p className="text-neutral-500 mt-1 text-sm">
          Revisa todos los planes de contenido y generaciones rápidas que hayas creado a lo largo del tiempo.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-subtle">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 pb-3 text-sm font-semibold border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-brand text-brand'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Planes de contenido */}
      {activeTab === 'planes' && (
        <div className="flex flex-col gap-8">
          {/* Planes creados */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-neutral-950">Planes creados</h2>
                {activePlansCount > 0 && (
                  <span className="text-xs font-bold bg-indigo-100 text-brand px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {activePlansCount} activo{activePlansCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {plans.length === 0 ? (
              <div className="border border-border-subtle rounded-2xl p-10 text-center text-neutral-400 text-sm">
                Todavía no creaste ningún plan.{' '}
                <Link href="/plans" className="text-brand font-semibold hover:underline">
                  Crear uno
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => {
                  const { networks, totalPosts, publishedPosts } = getPlanMeta(plan.id)
                  return (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      networks={networks}
                      totalPosts={totalPosts}
                      publishedPosts={publishedPosts}
                      calendarEntries={calendarEntries}
                    />
                  )
                })}
              </div>
            )}
          </div>

          {/* Publicaciones pasadas */}
          <div className="border border-border-subtle rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h2 className="text-lg font-bold text-neutral-950">Publicaciones pasadas</h2>
            </div>
            <PastPublicationsTable entries={pastEntries} />
          </div>
        </div>
      )}

      {/* Tab: Generaciones Rápidas */}
      {activeTab === 'generaciones' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-950">Generaciones Rápidas</h2>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Total: {quickGenerations.length}
            </span>
          </div>
          <QuickGenerationsTable generations={quickGenerations} />
        </div>
      )}
    </div>
  )
}
