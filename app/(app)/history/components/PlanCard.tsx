import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { SocialIcon } from './SocialIcon'
import type { ContentPlan } from '@/lib/types'
import { cn, getPlanObjectiveLabel } from '@/lib/utils'

type PlanCardProps = {
  plan: ContentPlan
  networks: string[]
  totalPosts: number
  publishedPosts: number
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

export function PlanCard({ plan, networks, totalPosts, publishedPosts }: PlanCardProps) {
  const isActive = plan.status === 'active'
  const progress = totalPosts > 0 ? (publishedPosts / totalPosts) * 100 : 0

  return (
    <div className="border border-border-subtle rounded-2xl p-5 flex flex-col gap-4 bg-surface-white">

      {/* Badge + archivo */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider',
            isActive
              ? 'bg-green-500 text-white'
              : 'border border-neutral-300 text-neutral-500',
          )}
        >
          {isActive ? 'Activo' : 'Finalizado'}
        </span>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors">
          <ArchiveIcon />
        </button>
      </div>

      {/* Título */}
      <h3 className="font-bold text-xl text-neutral-950 leading-snug">{getPlanObjectiveLabel(plan.objective)}</h3>

      {/* Fechas */}
      <div className="flex items-center gap-1.5 text-sm text-neutral-500">
        <svg className="w-4 h-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
        <span>{formatDate(plan.periodStart)} — {formatDate(plan.periodEnd)}</span>
      </div>

      {/* Redes */}
      {networks.length > 0 && (
        <div className="flex items-center gap-2">
          {networks.map((net) => (
            <SocialIcon key={net} network={net} size="md" />
          ))}
        </div>
      )}

      {/* Progreso */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-500 font-medium">Progreso</span>
          <div className="flex items-center gap-1">
            <span className="text-brand font-semibold">
              {publishedPosts}/{totalPosts > 0 ? totalPosts : '?'} publicaciones
            </span>
            <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
          </div>
        </div>
        <div className="w-full h-2 bg-indigo-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Botones */}
      <div className="flex flex-col gap-2 mt-1">
        <Link href="/calendar" className="w-full">
          <Button className="w-full">VER CALENDARIO</Button>
        </Link>
        <Link href={`/plans/${plan.id}`} className="w-full">
          <Button variant="secondary" className="w-full">VER DETALLE</Button>
        </Link>
      </div>
    </div>
  )
}
