'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CalendarList, CalendarRow } from '@/components/ui/CalendarRow'
import { ContentDetailModal } from '@/components/ui/ContentDetailModal'
import { useUpdatePlan } from '@/lib/hooks/use-plans'
import { getPlanObjectiveLabel } from '@/lib/utils'
import type { ContentPlanResponse, ContentPost } from '@/lib/types'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined'

type PlanDetailClientProps = {
  plan: ContentPlanResponse
}

export function PlanDetailClient({ plan }: PlanDetailClientProps) {
  const router = useRouter()
  const updatePlan = useUpdatePlan()
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isActive = plan.status === 'active'
  const planTitle = getPlanObjectiveLabel(plan.objective)

  const handleArchive = async () => {
    const newStatus = isActive ? 'archived' : 'active'
    if (confirm(`¿Estás seguro de que querés ${isActive ? 'archivar' : 'desarchivar'} este plan?`)) {
      await updatePlan.mutateAsync({ id: plan.id, status: newStatus })
      router.refresh()
    }
  }

  const handleSelectPost = (post: ContentPost) => {
    setSelectedPost(post)
    setIsModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      {/* Navegación y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link 
          href="/history" 
          className="flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-brand transition-colors"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Volver al historial
        </Link>

        <Button
          variant="outline"
          onClick={handleArchive}
          disabled={updatePlan.isPending}
          className="flex items-center gap-2 text-neutral-600 border-neutral-200 hover:bg-neutral-50 h-9 px-4"
        >
          {isActive ? (
            <>
              <ArchiveOutlinedIcon className="w-4 h-4" />
              Archivar plan
            </>
          ) : (
            <>
              <UnarchiveOutlinedIcon className="w-4 h-4" />
              Reactivar plan
            </>
          )}
        </Button>
      </div>

      {/* Header del Plan */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-neutral-950">{planTitle}</h1>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
          }`}>
            {isActive ? 'Activo' : 'Archivado'}
          </span>
        </div>
        <p className="text-neutral-500 flex items-center gap-2 text-sm">
          <span className="font-medium text-neutral-900">Periodo:</span>
          {new Date(plan.periodStart + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })}
          <span className="text-neutral-300">/</span>
          {new Date(plan.periodEnd + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Estrategia y Acciones */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <section className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-neutral-950 mb-4 flex items-center gap-2">
              <img src="/assets/icons/speaker.svg" className="w-5 h-5" alt="" />
              Estrategia
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap italic">
              "{plan.strategySummary}"
            </p>
          </section>

          {plan.recommendedActions.length > 0 && (
            <section className="bg-surface-primary-ghost border border-brand-100 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2">
                <img src="/assets/icons/lightning.svg" className="w-5 h-5" alt="" />
                Recomendaciones
              </h2>
              <ul className="flex flex-col gap-3">
                {plan.recommendedActions.map((action, i) => (
                  <li key={i} className="text-sm text-neutral-700 flex gap-3">
                    <span className="text-brand font-bold">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Columna Derecha: Contenido */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-neutral-950 flex items-center gap-2">
              <img src="/assets/icons/doc.svg" className="w-5 h-5" alt="" />
              Contenido Planificado
            </h2>
            <span className="text-xs text-neutral-500 font-medium">
              {plan.posts.length} publicaciones
            </span>
          </div>

          {plan.posts.length > 0 ? (
            <CalendarList>
              {plan.posts.map((post) => (
                <CalendarRow
                  key={post.id}
                  date={new Date(post.scheduledDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'short' })}
                  time="11:00"
                  title={post.copy?.split('\n')[0] || 'Sin título'}
                  contentType={post.format || 'Post'}
                  socialNetwork={post.network || 'Instagram'}
                  source="plan"
                  onClick={() => handleSelectPost(post)}
                />
              ))}
            </CalendarList>
          ) : (
            <div className="bg-white border border-border-subtle rounded-2xl p-12 text-center">
              <p className="text-neutral-400 text-sm">Este plan no incluye piezas de contenido para redes sociales.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalle */}
      <ContentDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={selectedPost ? {
          image: "https://placehold.co/600x400",
          imageAlt: "",
          date: new Date(selectedPost.scheduledDate + 'T12:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'long' }),
          title: planTitle,
          description: (selectedPost.copy || '') + (selectedPost.imageSuggestion ? `\n\nSugerencia IA: ${selectedPost.imageSuggestion}` : ''),
          socialNetwork: selectedPost.network || 'Instagram',
          format: selectedPost.format || 'Post'
        } : null}
      />
    </div>
  )
}