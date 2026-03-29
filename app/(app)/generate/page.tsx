'use client'

import { useState } from 'react'
import type { GenerateQuickResponse, AIVariant } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GoalOption } from '@/components/ui/GoalOption'
import { GeneratedContentCard } from '@/components/ui/GeneratedContentCard'
import { Multiselect } from '@/components/ui/Multiselect'

const FORMATS = ['post', 'reel', 'carrusel', 'historia']

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

export default function GeneratePage() {
  const [format, setFormat] = useState('post')
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateQuickResponse | null>(null)
  const [chosen, setChosen] = useState<AIVariant | null>(null)
  const [saved, setSaved] = useState(false)
  const [products, setProducts] = useState<string[]>([])
  const [audiences, setAudiences] = useState<string[]>([])
  const [tone, setTone] = useState('cercano')
  const [objective, setObjective] = useState(GOAL_OPTIONS[0].value)

  const TONE_OPTIONS = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'cercano', label: 'Cercano' },
    { value: 'profesional', label: 'Profesional' },
  ]

  async function handleGenerate() {
    setLoading(true)
    setResult(null)
    setChosen(null)
    setSaved(false)

    const res = await fetch('/api/generate/quick', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, detail }),
    })
    const data: GenerateQuickResponse = await res.json()
    setResult(data)
    setLoading(false)
  }

  async function handleSave() {
    if (!chosen) return
    await fetch('/api/quick-generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ format, detail, copy: chosen.copy, imageSuggestion: chosen.imageSuggestion }),
    })
    setSaved(true)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-950">Generación rápida</h1>
      <p className="text-sm text-neutral-500 mb-4">Crea las descripciones adecuadas para tus publicaciones de manera rápida.</p>

      <div className="bg-surface-white border border-border-subtle rounded-2xl p-6 flex flex-col gap-6">

        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-primary-ghost">
            <img src="/assets/icons/graph-purple.svg" />
          </span>
          <span className="font-bold text-base text-neutral-950">Parámetros</span>
        </div>

        <Select
          id="select-product"
          label="¿Cómo querés publicarlo?"
          options={[]}
          value={format}
          onChange={setFormat}
          placeholder="Selecciona como querés publicar contenido"
        />


        <Multiselect
          id="preview-multiselect"
          label="¿Qué producto o servicio querés destacar?"
          options={[]}
          value={products}
          onChange={setProducts}
          onCreateNew={(label) => alert(`Crear: ${label}`)}
          placeholder="Selecciona tus productos y/o servicios"
        />

        <Multiselect
          id="preview-multiselect"
          label="¿A quién le querés hablar?"
          options={[]}
          value={audiences}
          onChange={setAudiences}
          onCreateNew={(label) => alert(`Crear: ${label}`)}
          placeholder="Selecciona tus audiencias"
        />

        <Select
          id="select-tone"
          label="Personalidad del mensaje"
          options={TONE_OPTIONS}
          value={tone}
          onChange={setTone}
          placeholder="Selecciona un tono y voz"
        />

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
              {loading ? 'Generando tu contenido...' : '✦ Generar contenido'}
            </Button>
        </div>
      </div>

      {/* Variantes generadas */}
      {result && (
        <div className="flex flex-col gap-6 mt-6">
          <h2 className="font-bold text-2xl text-neutral-950 flex items-center gap-2">
            <span className="text-brand"><img src="/assets/icons/spark.svg" alt="" /></span> Variantes generadas
          </h2>
          <div className="flex flex-col gap-4">
            {result.variants.map((v, i) => (
              <GeneratedContentCard
                key={v.variant}
                content={v.copy}
                imageHint={`Sugerencia: ${v.imageSuggestion}`}
                recommended={i === 0}
                onRegenerate={handleGenerate}
                onCopy={(text) => navigator.clipboard.writeText(text)}
                onSave={(text) => {
                  setChosen(v)
                  handleSave()
                }}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="flex flex-col items-center gap-1 py-6 text-neutral-500 hover:text-brand transition-colors"
          >
            <span className="flex items-center gap-2 font-semibold text-sm">
              <img src="/assets/icons/redo.svg" alt="" />
              Generar nuevo contenido
            </span>
            <span className="text-xs text-neutral-400">Vuelve a crear 3 variantes de descripciones para otra idea que tengas</span>
          </button>
        </div>
      )}
    </div>
  )
}
