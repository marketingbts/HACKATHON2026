'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GeneratePlanResponse, AIPlanPost, AIVariant } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GoalOption } from '@/components/ui/GoalOption'
import { SectionHeader } from '@/components/ui/SectionHeader'

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
  { value: 'profesional', label: 'Profesional' },
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
  const [result, setResult] = useState<GeneratePlanResponse | null>(null)
  const [chosenVariants, setChosenVariants] = useState<Record<number, AIVariant>>({})
  const [saved, setSaved] = useState(false)

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
    setChosenVariants({})
    const res = await fetch('/api/generate/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ objective, tone, product, audience, period }),
    })
    const data: GeneratePlanResponse = await res.json()
    setResult(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!result) return
    const posts = result.posts.map((p, i) => ({
      scheduledDate: p.scheduledDate,
      network: p.network,
      format: p.format,
      copy: chosenVariants[i]?.copy ?? p.variants[0].copy,
      imageSuggestion: chosenVariants[i]?.imageSuggestion ?? p.variants[0].imageSuggestion,
    }))
    await fetch('/api/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ planId: result.planId, posts }),
    })
    setSaved(true)
    setTimeout(() => router.push('/plans'), 1000)
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-neutral-950">Plan de contenido</h1>
      <p className="text-sm text-neutral-500 mb-4">Revisa y edita cada detalle de tu plan antes de comenzar a trabajar</p>

      {!result && (
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

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? 'Generando tu plan...' : `
              ✦ 
              Generar plan
            `}
          </Button>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-6">
          {/* Resumen estratégico */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-2">Resumen de estrategia</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{result.strategySummary}</p>
          </div>

          {/* Acciones recomendadas */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="font-semibold mb-3">Acciones recomendadas</h2>
            <ul className="flex flex-col gap-2">
              {result.recommendedActions.map((a, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span>→</span>
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Posts con variantes */}
          <div>
            <h2 className="font-semibold mb-3">Contenido para publicar</h2>
            <div className="flex flex-col gap-4">
              {result.posts.map((post: AIPlanPost, i: number) => (
                <div key={i} className="bg-white border rounded-lg p-5">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="font-medium text-sm">{post.scheduledDate}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        {post.network} · {post.format}
                      </span>
                    </div>
                    {chosenVariants[i] && (
                      <span className="text-xs text-green-600 font-medium">Variante elegida ✓</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    {post.variants.map((v: AIVariant) => (
                      <div
                        key={v.variant}
                        className={`border rounded p-3 cursor-pointer transition ${
                          chosenVariants[i]?.variant === v.variant
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => setChosenVariants({ ...chosenVariants, [i]: v })}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-gray-400">Variante {v.variant}</span>
                          {chosenVariants[i]?.variant === v.variant && (
                            <span className="text-xs font-medium">✓</span>
                          )}
                        </div>
                        <p className="text-sm">{v.copy}</p>
                        <p className="text-xs text-gray-400 italic mt-1">📷 {v.imageSuggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={saved}
            >
              {saved ? 'Plan guardado ✓' : 'Guardar plan'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
            >
              Volver a configurar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
