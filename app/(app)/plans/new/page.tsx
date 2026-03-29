'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Multiselect } from '@/components/ui/Multiselect'
import { GoalOption } from '@/components/ui/GoalOption'
import { ContentCard } from '@/components/ui/ContentCard'
import { CalendarList, CalendarRow } from '@/components/ui/CalendarRow'
import { MarkiExplain } from '@/components/ui/MarkiExplain'
import { ProductModal } from '@/components/ui/ProductModal'
import { AudienceModal } from '@/components/ui/AudienceModal'
import { ContentDetailModal } from '@/components/ui/ContentDetailModal'
import { ContentEditModal } from '@/components/ui/ContentEditModal'
import { useAudiences, useProducts } from '@/lib/hooks/use-business'
import { useGeneratePlan, useSavePlan } from '@/lib/hooks/use-plans'
import type { GeneratePlanResponse, AIPlanPost } from '@/lib/types'

// ── Helpers ───────────────────────────────────────────────────────────────────
const POST_TYPE_LABEL: Record<string, string> = {
  post: 'Post', reel: 'Reel', story: 'Historia', carousel: 'Carrusel',
}
function formatDate(day: string): string {
  return new Date(day + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

const TONE_OPTIONS = [
  { value: 'formal', label: 'Formal' },
  { value: 'informal', label: 'Informal' },
  { value: 'cercano', label: 'Cercano' },
  { value: 'profesional', label: 'Profesional' },
]

const PERIOD_OPTIONS = [
  { value: 'day', label: 'Un día' },
  { value: 'week', label: 'Una semana' },
  { value: 'month', label: 'Un mes' },
]

const GOAL_OPTIONS = [
  {
    value: 'promote_offer',
    title: 'Vender más',
    description: 'Enfocado en conversión y CTA claro.',
    icon: (
      <img src="/assets/icons/cart-green.svg" />
    ),
  },
  {
    value: 'gain_followers',
    title: 'Informar o educar',
    description: 'Contenido de valor para tu audiencia.',
    icon: (
      <img src="/assets/icons/hat-purple.svg" alt="" />
    ),
  },
  {
    value: 'increase_engagement',
    title: 'Conectar',
    description: 'Humanizar la marca y generar empatía.',
    icon: (
      <img src="/assets/icons/heart-pink.svg" alt="" />
    ),
  },
]

export default function NewPlanPage() {
  const router = useRouter()
  const { data: audiences = [] } = useAudiences()
  const { data: products = [] } = useProducts()
  const generatePlan = useGeneratePlan()
  const savePlan = useSavePlan()

  const [result, setResult] = useState<GeneratePlanResponse | null>(null)
  const [chosenCopies, setChosenCopies] = useState<Record<number, number>>({})
  const [calendarView, setCalendarView] = useState<'list' | 'grid'>('list')
  const [feedback, setFeedback] = useState('')

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([])
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false)
  const [initialProductName, setInitialProductName] = useState('')
  const [initialAudienceName, setInitialAudienceName] = useState('')
  const [selectedDetailContent, setSelectedDetailContent] = useState<any>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingPostIndex, setEditingPostIndex] = useState<number | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [tone, setTone] = useState('cercano')
  const [objective, setObjective] = useState(GOAL_OPTIONS[0].value)
  const [period, setPeriod] = useState<any>('week')

  const productOptions = products.map((p) => ({ value: p.id, label: p.name }))
  const audienceOptions = audiences.map((a) => ({ value: a.id, label: a.name }))

  async function handleGenerate() {
    setChosenCopies({})
    const data = await generatePlan.mutateAsync({
      objective,
      tone,
      productIds: selectedProductIds,
      audienceIds: selectedAudienceIds,
      period,
    })
    setResult(data)
  }

  async function handleRefine() {
    if (!feedback.trim() || !result) return
    setChosenCopies({})
    const data = await generatePlan.mutateAsync({
      objective,
      tone,
      productIds: selectedProductIds,
      audienceIds: selectedAudienceIds,
      period,
      feedback,
      previousPlan: result,
    })
    setResult(data)
    setFeedback('')
  }

  function handleUpdateCopy(index: number, newCopy: string) {
    if (!result) return
    const newPosts = [...result.posts]
    const copyIdx = chosenCopies[index] ?? 0
    newPosts[index].variants[copyIdx].copy = newCopy
    setResult({ ...result, posts: newPosts })
  }

  async function handleSave() {
    if (!result) return

    const PERIOD_DAYS: Record<string, number> = { day: 1, week: 7, month: 30 }
    const periodStart = new Date().toISOString().split('T')[0]
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + PERIOD_DAYS[period])
    const periodEnd = endDate.toISOString().split('T')[0]

    await savePlan.mutateAsync({
      objective,
      tone,
      periodStart,
      periodEnd,
      strategySummary: result.strategySummary,
      recommendedActions: result.recommendedActions,
      audienceIds: selectedAudienceIds,
      productIds: selectedProductIds,
      posts: result.posts.map((p, i) => {
        const copyIdx = chosenCopies[i] ?? 0
        return {
          scheduledDate: p.scheduledDate,
          network: p.network,
          format: p.format,
          copy: p.variants[copyIdx].copy,
          imageSuggestion: p.variants[copyIdx].imageSuggestion,
        }
      }),
    })
    router.push('/plans')
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-neutral-950">Plan de contenido</h1>
        <p className="text-sm text-neutral-500 mt-1">Revisa y edita cada detalle de tu plan antes de comenzar a trabajar</p>
      </div>

      <div className="bg-surface-white border border-border-subtle rounded-2xl p-6 flex flex-col gap-6">

          {/* Section header */}
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary-ghost">
              <img src="/assets/icons/graph-purple.svg" />
            </span>
            <span className="font-bold text-base text-neutral-950">Configuración del Plan</span>
          </div>

          {/* Producto */}
          <Multiselect
            id="select-product"
            label="¿Qué producto o servicio querés destacar?"
            options={productOptions}
            value={selectedProductIds}
            onChange={setSelectedProductIds}
            onCreateNew={(name) => {
              setInitialProductName(name)
              setIsProductModalOpen(true)
            }}
            placeholder="Selecciona tus productos y/o servicios"
          />

          {/* Audiencia */}
          <Multiselect
            id="select-audience"
            label="¿A quién le querés hablar?"
            options={audienceOptions}
            value={selectedAudienceIds}
            onChange={setSelectedAudienceIds}
            onCreateNew={(name) => {
              setInitialAudienceName(name)
              setIsAudienceModalOpen(true)
            }}
            placeholder="Selecciona tus audiencias"
          />

          {/* Fechas + Tono */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Select
                id="select-tone"
                label="¿Cuánto querés que dure la estrategia?"
                options={PERIOD_OPTIONS}
                value={period}
                onChange={setPeriod}
                placeholder="Seleccioná la duración"
              />
            </div>

            <Select
              id="select-tone"
              label="Personalidad del mensaje"
              options={TONE_OPTIONS}
              value={tone}
              onChange={setTone}
              placeholder="Selecciona un tono y voz"
            />
          </div>

          {/* Objetivo */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-neutral-700">¿Qué querés lograr con este plan de contenido?</label>
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Objetivo del plan</legend>
              {GOAL_OPTIONS.map((opt) => (
                <GoalOption
                  key={opt.value}
                  name="objective"
                  value={opt.value}
                  title={opt.title}
                  description={opt.description}
                  icon={opt.icon}
                  checked={objective === opt.value}
                  onChange={setObjective}
                />
              ))}
            </fieldset>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              variant="primary" 
              onClick={handleGenerate} 
              disabled={generatePlan.isPending || selectedProductIds.length === 0 || selectedAudienceIds.length === 0}
            >
              {generatePlan.isPending ? 'Generando tu plan...' : '✦ Generar plan'}
            </Button>
          </div>
        </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        initialName={initialProductName}
        onSuccess={(id) => setSelectedProductIds((prev) => [...prev, id])}
      />

      <AudienceModal
        isOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        initialName={initialAudienceName}
        onSuccess={(id) => setSelectedAudienceIds((prev) => [...prev, id])}
      />

      <ContentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        content={selectedDetailContent}
      />

      <ContentEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingPostIndex(null)
        }}
        initialCopy={editingPostIndex !== null && result ? result.posts[editingPostIndex].variants[chosenCopies[editingPostIndex] ?? 0].copy : ''}
        onSave={(newCopy) => {
          if (editingPostIndex !== null) {
            handleUpdateCopy(editingPostIndex, newCopy)
          }
        }}
      />

      {result && (
        <div className="flex flex-col gap-10 mt-5">

          {/* ── 1. Estrategia recomendada ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
              <span className="text-brand"><img src="/assets/icons/pin.svg" alt="" /></span> 1. Estrategia recomendada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Resumen de Estrategia */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-5 flex flex-col gap-3 col-span-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary-ghost">
                    <img src="/assets/icons/speaker.svg" alt="" />
                  </span>
                  <span className="font-bold text-sm text-neutral-950">Estrategia Recomendada</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap">{result.strategySummary}</p>
              </div>

              {/* Insight de IA */}
              <MarkiExplain content="Esta estrategia está diseñada para maximizar el impacto en tus audiencias seleccionadas utilizando los productos destacados." />
            </div>
          </section>

          {/* ── 2. Piezas de Contenido Generadas ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
              <img src="/assets/icons/doc.svg" alt="" />
              2. Piezas de Contenido Generadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {result.posts.map((post, i) => {
                const copyIdx = chosenCopies[i] ?? 0
                const currentVariant = post.variants[copyIdx]

                return (
                  <div key={i} className="relative">
                    <ContentCard
                      image="https://placehold.co/600x400"
                      imageAlt=""
                      date={formatDate(post.scheduledDate)}
                      dateTime={`${post.scheduledDate}T${result.calendar.find((c) => c.date === post.scheduledDate)?.suggestedTime ?? '11:00'}`}
                      title={currentVariant.copy.split('\n')[0]}
                      description={currentVariant.imageSuggestion}
                      socialNetwork="Instagram"
                      format={POST_TYPE_LABEL[post.format]}
                      recommended={i === 0}
                      onViewMore={() => {
                        setSelectedDetailContent({
                          image: "https://placehold.co/600x400",
                          imageAlt: "",
                          date: formatDate(post.scheduledDate),
                          title: currentVariant.copy.split('\n')[0],
                          description: currentVariant.copy + "\n\nSugerencia IA: " + currentVariant.imageSuggestion,
                          socialNetwork: "Instagram",
                          format: POST_TYPE_LABEL[post.format]
                        })
                        setIsDetailModalOpen(true)
                      }}
                      onEdit={() => {
                        setEditingPostIndex(i)
                        setIsEditModalOpen(true)
                      }}
                      onNext={() => setChosenCopies((prev) => ({ ...prev, [i]: (copyIdx + 1) % post.variants.length }))}
                      onPrev={() => setChosenCopies((prev) => ({ ...prev, [i]: (copyIdx - 1 + post.variants.length) % post.variants.length }))}
                    />
                  </div>
                )
              })}
              <div className="flex flex-col items-center justify-center min-h-[350px] border-2 border-dashed border-border-subtle rounded-xl text-neutral-400 cursor-pointer hover:border-brand hover:text-brand transition-colors p-6 gap-2">
                <span className="text-2xl leading-none font-light">+</span>
                <span className="text-center text-xs leading-snug">Generar pieza adicional</span>
              </div>
            </div>
          </section>

          {/* ── 3. Acciones de Crecimiento ── */}
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <span className="text-brand"><img src="/assets/icons/lightning.svg" alt="" /></span> 3. Acciones de Crecimiento
              </h2>
              <p className="text-sm text-neutral-500">Expandí cada acción para conocer más detalles</p>
            </div>
            <div className="flex flex-col gap-3">
              {result.recommendedActions.map((action: string, i: number) => {
                const sepIdx = action.indexOf(' | ')
                const title = sepIdx !== -1 ? action.slice(0, sepIdx) : action
                const desc = sepIdx !== -1 ? action.slice(sepIdx + 3) : ''
                return (
                  <div key={i} className="flex items-center gap-4 bg-surface-white border border-border-subtle rounded-xl p-4 cursor-pointer hover:border-border-primary transition-colors">
                    <span className="text-xs font-bold text-brand shrink-0 w-6">{String(i + 1).padStart(2, '0')}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-neutral-950">{title}</p>
                      {desc && <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>}
                    </div>
                    <svg className="shrink-0 text-neutral-400" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )
              })}
            </div>
          </section>

          {/* ── 4. Calendario de Publicación ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
              <img src="/assets/icons/calendar-purple.svg" alt="" />
              4. Calendario de Publicación
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border-subtle">
              {(['list', 'grid'] as const).map((view) => (
                <button
                  key={view}
                  onClick={() => setCalendarView(view)}
                  className={`pb-2 px-3 text-sm font-medium transition-colors ${
                    calendarView === view
                      ? 'border-b-2 border-brand text-brand'
                      : 'text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  {view === 'list' ? 
                  <div className='flex items-center gap-2'>
                    <img src="/assets/icons/list.svg" alt="" />
                    Lista
                  </div> : 
                  <div className='flex items-center gap-2'>
                    <img src="/assets/icons/calendar.svg" alt="" />
                    Calendario
                  </div>
                  }
                </button>
              ))}
            </div>

            {calendarView === 'list' && (
              <CalendarList>
                {result.calendar
                  .filter((e) => e.type === 'publication')
                  .map((entry, i) => (
                    <CalendarRow
                      key={i}
                      date={formatDate(entry.date)}
                      time={entry.suggestedTime}
                      title={entry.action}
                      contentType="Publicación"
                      socialNetwork="Instagram"
                    />
                  ))}
              </CalendarList>
            )}

            {calendarView === 'grid' && (
              <div className="overflow-x-auto rounded-xl border border-border-subtle bg-surface-white">
                <table className="w-full text-xs min-w-[560px]">
                  <thead>
                    <tr className="border-b border-border-subtle">
                      <th className="text-left text-neutral-400 font-medium py-3 px-4 w-28">DÍA</th>
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d) => (
                        <th key={d} className="text-center text-neutral-400 font-medium py-3 px-2 uppercase tracking-wide text-[10px]">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(['Publicación', 'Objetivo', 'Canal', 'Formato'] as const).map((row) => (
                      <tr key={row} className="border-b border-border-subtle last:border-0">
                        <td className="text-neutral-500 py-3 px-4 font-medium">{row}</td>
                        {[0, 1, 2, 3, 4, 5, 6].map((weekday) => {
                          const entry = result.calendar.find((e) => new Date(e.date + 'T12:00:00').getDay() === (weekday === 0 ? 0 : weekday))
                          const post = entry ? result.posts.find((p) => p.scheduledDate === entry.date) : null
                          let cell = ''
                          if (entry && row === 'Publicación') cell = entry.action
                          if (entry && row === 'Objetivo') cell = entry.goal
                          if (entry && row === 'Canal') cell = 'Instagram'
                          if (post && row === 'Formato') cell = POST_TYPE_LABEL[post.format]
                          return (
                            <td key={weekday} className="py-3 px-2 text-center">
                              {cell && (
                                <span className={`${
                                  row === 'Canal' ? 'text-pink-600 font-semibold' :
                                  row === 'Formato' ? 'text-brand font-semibold' :
                                  'text-neutral-700'
                                }`}>{cell}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Feedback / Ajuste de plan */}
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
                <span>✦</span> ¿Querés ajustar el plan?
              </h2>
              <p className="text-sm text-neutral-500">Decile a Marki qué cambiar y regenerará el plan respetando lo que ya funciona.</p>
            </div>
            <div className="bg-surface-white border border-border-subtle rounded-xl p-4 flex flex-col gap-3">
              <textarea
                className="w-full border border-border-subtle rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
                rows={3}
                placeholder='Ej: "Quiero más reels y un tono más divertido" o "Cambiá el enfoque a promoción del fin de semana"'
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              <Button variant="outline" onClick={handleRefine} disabled={generatePlan.isPending || !feedback.trim()}>
                {generatePlan.isPending ? 'Ajustando tu plan...' : '✦ Ajustar plan con este feedback'}
              </Button>
            </div>
          </section>

          {/* Save */}
          <div className="flex flex-col gap-3 pb-8">
            <Button variant="primary" onClick={handleSave} disabled={savePlan.isPending}>
              {savePlan.isPending ? 'Guardando plan...' : 'Guardar plan de contenido'}
            </Button>
            <Button variant="outline" onClick={() => { setResult(null) }}>
              Volver a configurar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}