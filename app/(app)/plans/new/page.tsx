'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GoalOption } from '@/components/ui/GoalOption'
import { ContentCard } from '@/components/ui/ContentCard'
import { CalendarList, CalendarRow } from '@/components/ui/CalendarRow'
import { MarkiExplain } from '@/components/ui/MarkiExplain'

// ── Local types ─────────────────────────────────────────────────────────────
type PlanCopy = { text: string; visual_description: string }
type PlanPost = {
  day: string
  type: 'post' | 'reel' | 'story' | 'carousel'
  goal: string
  copies: PlanCopy[]
}
type PlanCalendarEntry = {
  day: string
  action: string
  type: 'publication' | 'action'
  goal: string
  suggested_time: string
}
type PlanResult = {
  strategy_summary: { approach: string; content_focus: string; timeline_explanation: string }
  posts: PlanPost[]
  recommended_actions: string[]
  calendar: PlanCalendarEntry[]
}

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

function derivePeriod(start: string, end: string): string {
  if (!start || !end) return 'week'
  const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24))
  if (diff <= 1) return 'day'
  if (diff <= 8) return 'week'
  return 'month'
}

export default function NewPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlanResult | null>(null)
  const [chosenCopies, setChosenCopies] = useState<Record<number, number>>({})
  const [saved, setSaved] = useState(false)
  const [calendarView, setCalendarView] = useState<'list' | 'grid'>('list')

  const [productOptions, setProductOptions] = useState<{ value: string; label: string }[]>([])
  const [audienceOptions, setAudienceOptions] = useState<{ value: string; label: string }[]>([])

  const [product, setProduct] = useState('')
  const [audience, setAudience] = useState('')
  const [tone, setTone] = useState('cercano')
  const [objective, setObjective] = useState(GOAL_OPTIONS[0].value)
  const [period, setPeriod] = useState('')

  useEffect(() => {
    fetch('/api/products', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        const options = data.map((p) => ({ value: p.id, label: p.name }))
        setProductOptions(options)
        if (options.length > 0) setProduct(options[0].value)
      })

    fetch('/api/audiences', { credentials: 'include' })
      .then((r) => r.json())
      .then((data: { id: string; name: string }[]) => {
        const options = data.map((a) => ({ value: a.id, label: a.name }))
        setAudienceOptions(options)
        if (options.length > 0) setAudience(options[0].value)
      })
  }, [])

  async function handleGenerate() {
    setLoading(true)
    setResult(null)
    setChosenCopies({})
    const res = await fetch('/api/generate/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ objective, tone, product, audience, period }),
    })
    const data: PlanResult = await res.json()
    setResult(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!result) return
    const posts = result.posts.map((p, i) => {
      const copyIdx = chosenCopies[i] ?? 0
      return {
        scheduledDate: p.day,
        network: 'instagram',
        format: p.type,
        copy: p.copies[copyIdx].text,
        imageSuggestion: p.copies[copyIdx].visual_description,
      }
    })
    await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ posts }),
    })
    setSaved(true)
    setTimeout(() => router.push('/plans'), 1000)
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
          <Select
            id="select-product"
            label="¿Qué producto o servicio querés destacar?"
            options={productOptions}
            value={product}
            onChange={setProduct}
            placeholder="Selecciona tus productos y/o servicios"
          />

          {/* Audiencia */}
          <Select
            id="select-audience"
            label="¿A quién le querés hablar?"
            options={audienceOptions}
            value={audience}
            onChange={setAudience}
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
            <Button variant="primary" onClick={handleGenerate} disabled={loading}>
              {loading ? 'Generando tu plan...' : '✦ Generar plan'}
            </Button>
          </div>
        </div>

      {result && (
        <div className="flex flex-col gap-10 mt-5">

          {/* ── 1. Estrategia recomendada ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
              <span className="text-brand"><img src="/assets/icons/pin.svg" alt="" /></span> 1. Estrategia recomendada
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pilares de Contenido */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary-ghost">
                    <img src="/assets/icons/head.svg" alt="" />
                  </span>
                  <span className="font-bold text-sm text-neutral-950">Pilares de Contenido</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {result.strategy_summary.content_focus.split('·').map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-neutral-700">
                      <span className="text-green-600 font-bold">✓</span>
                      {item.trim()}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Propuesta de Valor */}
              <div className="bg-surface-white border border-border-subtle rounded-xl p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary-ghost">
                    <img src="/assets/icons/speaker.svg" alt="" />
                  </span>
                  <span className="font-bold text-sm text-neutral-950">Propuesta de Valor</span>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{result.strategy_summary.approach}</p>
              </div>

              {/* Insight de IA */}
              <MarkiExplain content={result.strategy_summary.timeline_explanation} />
            </div>
          </section>

          {/* ── 2. Piezas de Contenido Generadas ── */}
          <section className="flex flex-col gap-4">
            <h2 className="font-bold text-xl text-brand-900 flex items-center gap-2">
              <img src="/assets/icons/doc.svg" alt="" />
              2. Piezas de Contenido Generadas
            </h2>
            <div className="flex flex-nowrap gap-4 overflow-x-auto pb-3 -mx-6 px-6" style={{ scrollSnapType: 'x mandatory' }}>
              {result.posts.map((post, i) => (
                <div key={i} className=" shrink-0" style={{ scrollSnapAlign: 'start' }}>
                  <ContentCard
                    image="https://placehold.co/600x400"
                    imageAlt=""
                    date={formatDate(post.day)}
                    dateTime={`${post.day}T${result.calendar.find((c) => c.day === post.day)?.suggested_time ?? '11:00'}`}
                    title={post.copies[chosenCopies[i] ?? 0].text.split('\n')[0]}
                    description={post.copies[chosenCopies[i] ?? 0].visual_description}
                    socialNetwork="Instagram"
                    format={POST_TYPE_LABEL[post.type]}
                    recommended={i === 0}
                    onViewMore={() => setChosenCopies((prev) => ({ ...prev, [i]: ((prev[i] ?? 0) + 1) % post.copies.length }))}
                    onEdit={() => {}}
                  />
                </div>
              ))}
              <div className="shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-border-subtle rounded-xl text-neutral-400 cursor-pointer hover:border-brand hover:text-brand transition-colors p-6 gap-2" style={{ scrollSnapAlign: 'start' }}>
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
              {result.recommended_actions.map((action, i) => {
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
                      date={formatDate(entry.day)}
                      time={entry.suggested_time}
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
                          const entry = result.calendar.find((e) => new Date(e.day).getDay() === weekday)
                          const post = entry ? result.posts.find((p) => p.day === entry.day) : null
                          let cell = ''
                          if (entry && row === 'Publicación') cell = entry.action
                          if (entry && row === 'Objetivo') cell = entry.goal
                          if (entry && row === 'Canal') cell = 'Instagram'
                          if (post && row === 'Formato') cell = POST_TYPE_LABEL[post.type]
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

          {/* Save */}
          <div className="flex flex-col gap-3 pb-8">
            <Button variant="primary" onClick={handleSave} disabled={saved}>
              {saved ? 'Plan guardado ✓' : 'Guardar plan de contenido'}
            </Button>
            <Button variant="outline" onClick={() => { setResult(null); setSaved(false) }}>
              Volver a configurar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
