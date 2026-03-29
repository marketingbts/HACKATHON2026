import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SocialIcon } from './SocialIcon'
import { PlanCalendarModal } from './PlanCalendarModal'
import { useUpdatePlan } from '@/lib/hooks/use-plans'
import type { ContentPlan, CalendarEntry } from '@/lib/types'
import { cn, getPlanObjectiveLabel } from '@/lib/utils'

type PlanCardProps = {
  plan: ContentPlan
  networks: string[]
  totalPosts: number
  publishedPosts: number
  calendarEntries: CalendarEntry[]
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function ArchiveIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

export function PlanCard({ plan, networks, totalPosts, publishedPosts, calendarEntries }: PlanCardProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const updatePlan = useUpdatePlan()
  const isActive = plan.status === 'active'
  const progress = totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0

  const planTitle = getPlanObjectiveLabel(plan.objective)
  const planEntries = calendarEntries.filter(e => e.planId === plan.id)

  const handleArchive = async () => {
    const newStatus = isActive ? 'archived' : 'active'
    if (confirm(`¿Estás seguro de que querés ${isActive ? 'archivar' : 'desarchivar'} este plan?`)) {
      await updatePlan.mutateAsync({ id: plan.id, status: newStatus })
    }
  }

  return (
    <div className="border border-border-subtle rounded-2xl p-4 flex flex-col gap-3.5 bg-surface-white">

      {/* Badge + archivo */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider',
            isActive
              ? 'bg-green-500 text-white'
              : 'border border-neutral-300 text-neutral-500',
          )}
        >
          {isActive ? 'Activo' : 'Finalizado'}
        </span>
        <button 
          onClick={handleArchive}
          disabled={updatePlan.isPending}
          title={isActive ? 'Archivar plan' : 'Desarchivar plan'}
          className="text-neutral-300 hover:text-neutral-500 transition-colors disabled:opacity-50"
        >
          <ArchiveIcon />
        </button>
      </div>

      {/* Título */}
      <h3 className="font-bold text-lg text-neutral-950 leading-tight">{getPlanObjectiveLabel(plan.objective)}</h3>

      {/* Fechas */}
      <div className="flex items-center gap-1.5 text-[12px] text-neutral-500">
        <svg className="w-3.5 h-3.5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{formatDate(plan.periodStart)} — {formatDate(plan.periodEnd)}</span>
      </div>

      {/* Redes */}
      {networks.length > 0 && (
        <div className="flex items-center gap-1.5">
          {networks.map((net) => (
            <SocialIcon key={net} network={net} size="sm" />
          ))}
        </div>
      )}

      {/* Progreso */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-neutral-400 font-medium">Progreso</span>
          <span className="text-brand font-bold">
            {publishedPosts}/{totalPosts > 0 ? totalPosts : '?'} posts
          </span>
        </div>
        <div className="w-full h-1.5 bg-indigo-50 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 mt-1">
        <Button 
          className="w-full" 
          onClick={() => setIsCalendarOpen(true)}
        >
          VER CALENDARIO
        </Button>
        <Link href={`/plans/${plan.id}`} className="w-full">
          <Button variant="secondary" className="w-full">VER DETALLE</Button>
        </Link>
      </div>

      <PlanCalendarModal 
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        planTitle={planTitle}
        entries={planEntries}
      />
    </div>
  )
}
