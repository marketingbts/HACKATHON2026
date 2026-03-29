'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined'
import FormatListBulletedOutlinedIcon from '@mui/icons-material/FormatListBulletedOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'

import { SideNavBar } from '@/components/ui/SideNavBar'
import { TopNavBar } from '@/components/ui/TopNavBar'
import { HeroCard } from './components/HeroCard'
import { QuickAction } from '@/components/ui/QuickAction'
import { EmptyState } from '@/components/ui/EmptyState'
import { PostsTable } from './components/PostsTable'
import { cn } from '@/lib/utils'
import { useBusiness, useCalendar, mapCalendarResponseToUpcomingPosts } from '@/lib/services/dashboard'

type PostsTab = 'list' | 'calendar'

/* ── Section header: title + HR ── */
function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-bold text-[18px] text-neutral-950 whitespace-nowrap m-0">{title}</h2>
      <hr className="flex-1 border-t border-border-muted m-0" />
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<PostsTab>('list')

  const { data: businessData, error: businessError, isLoading: loadingBusiness } = useBusiness()
  const { data: calendarData, isLoading: loadingCalendar } = useCalendar()

  useEffect(() => {
    if (businessError?.message === 'Not Found') {
      router.push('/onboarding')
    }
  }, [businessError, router])

  if (loadingBusiness || loadingCalendar) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    )
  }

  const upcomingPosts = calendarData ? mapCalendarResponseToUpcomingPosts(calendarData) : []
  const hasPosts = upcomingPosts.length > 0

  const brandName = businessData?.name ?? 'Tu Negocio'

  return (
    <div className="flex min-h-screen bg-surface-background">
      {/* ── Sidebar ── */}
      <SideNavBar activeItem="dashboard" />

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col pl-60">
        {/* ── Top nav ── */}
        <TopNavBar
          greeting={`¡Buen día, ${brandName}! ☀️`}
          initials={brandName.substring(0, 2).toUpperCase() ?? '..'}
        />

        {/* ── Canvas ── */}
        <main
          className="flex flex-col gap-10 px-4 sm:px-6 lg:px-10 pt-[60px] py-10"
          id="dashboard-main"
        >
          {/* ── § 1 — Hero ── */}
          <section aria-label="Bienvenida" className='flex gap-4 flex-col'>
            <HeroCard
              brandName={brandName}
              brandLogoUrl={businessData?.logoUrl ?? undefined}
              socialNetworks={(businessData?.socialNetworks as any) ?? ['instagram', 'facebook']}
              onStartNow={() => router.push('/generate')}
              onContinue={() => router.push('/plans')}
            />
          </section>

          {/* ── § 2 — Quick actions ── */}
          <section aria-label="Acciones rápidas" className='flex gap-4 flex-col'>
            <SectionDivider title="Acciones rápidas" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <QuickAction
                variant="fast-create"
                title="Generación Rápida"
                description="Crea posts, captions y hashtags en menos de 30 segundos con IA."
                ctaLabel="Empezar a crear"
                icon={<BoltOutlinedIcon className="w-5 h-5 text-brand-500" />}
                onCtaClick={() => router.push('/generate')}
              />
              <QuickAction
                variant="create-plan"
                title="Plan de Contenido"
                description="Estrategia mensual completa. Organizamos tu calendario por vos."
                ctaLabel="Diseñar mes"
                icon={<CalendarMonthOutlinedIcon className="w-5 h-5 text-semantic-success-dark" />}
                onCtaClick={() => router.push('/plans')}
              />
              <QuickAction
                variant="view-plans"
                title="Mis Planes"
                description="Accede a tus borradores y planes de contenido anteriores."
                ctaLabel="Ir a archivos"
                icon={<FolderOpenOutlinedIcon className="w-5 h-5 text-neutral-550" />}
                onCtaClick={() => router.push('/calendar')}
              />
            </div>
          </section>

          {/* ── § 3 — Upcoming posts ── */}
          <section aria-label="Próximas publicaciones" className='flex gap-4 flex-col'>
            <SectionDivider title="Próximas publicaciones" />

            {!hasPosts ? (
              /* Empty state */
              <div
                className="border-2 border-dashed border-border-default rounded-lg bg-surface-subtle"
                style={{ padding: '52px 0' }}
              >
                <EmptyState
                  title="Todavía no tenés contenido"
                  description="Tu calendario está esperando nuevas ideas. Dejá que la IA trabaje por vos y generá tu primera publicación hoy mismo."
                  ctaLabel="Generar mi primer contenido"
                  onCta={() => router.push('/generate')}
                />
              </div>
            ) : (
              /* Filled state */
              <div className="rounded-lg border border-border-subtle overflow-hidden bg-surface-white">
                {/* Tab bar */}
                <div
                  className="flex border-b border-border-subtle"
                  role="tablist"
                  aria-label="Vista de publicaciones"
                >
                  <button
                    id="tab-list"
                    role="tab"
                    type="button"
                    aria-selected={activeTab === 'list'}
                    aria-controls="panel-list"
                    onClick={() => setActiveTab('list')}
                    className={cn(
                      'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-150',
                      activeTab === 'list'
                        ? 'border-b-2 border-brand-600 text-brand-600 font-semibold -mb-px'
                        : 'text-neutral-ui-muted hover:text-neutral-900',
                    )}
                  >
                    <FormatListBulletedOutlinedIcon sx={{ fontSize: 16 }} aria-hidden />
                    Lista
                  </button>
                  <button
                    id="tab-calendar"
                    role="tab"
                    type="button"
                    aria-selected={activeTab === 'calendar'}
                    aria-controls="panel-calendar"
                    onClick={() => setActiveTab('calendar')}
                    className={cn(
                      'flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors duration-150',
                      activeTab === 'calendar'
                        ? 'border-b-2 border-brand-600 text-brand-600 font-semibold -mb-px'
                        : 'text-neutral-ui-muted hover:text-neutral-900',
                    )}
                  >
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} aria-hidden />
                    Calendario
                  </button>
                </div>

                {/* Panels */}
                <div
                  id="panel-list"
                  role="tabpanel"
                  aria-labelledby="tab-list"
                  hidden={activeTab !== 'list'}
                  className='p-4'
                >
                  <PostsTable posts={upcomingPosts} />
                </div>

                <div
                  id="panel-calendar"
                  role="tabpanel"
                  aria-labelledby="tab-calendar"
                  hidden={activeTab !== 'calendar'}
                >
                  <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <CalendarTodayOutlinedIcon
                      className="text-neutral-ui-muted"
                      sx={{ fontSize: 40 }}
                    />
                    <p className="text-sm text-neutral-ui-muted font-medium">
                      Vista calendario — próximamente
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
