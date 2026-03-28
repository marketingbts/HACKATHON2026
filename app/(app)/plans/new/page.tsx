'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { GeneratePlanResponse, AIPlanPost, AIVariant } from '@/lib/types'

const OBJECTIVES = [
  'Lanzar un producto nuevo',
  'Ganar seguidores',
  'Aumentar comentarios e interacción',
  'Promocionar una oferta',
  'Fidelizar clientes existentes',
]

const TONES = ['Formal', 'Informal', 'Cercano', 'Profesional']
const PERIODS = ['daily', 'weekly', 'monthly']
const PRODUCTS_MOCK = [
      "Viandas semanales",
      "Plan mensual",
      "Plan vegetariano",
      "Envío a domicilio"
    ]
const AUDIENCE_MOCK = [
  "Mamás del barrio"
]

export default function NewPlanPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeneratePlanResponse | null>(null)
  const [chosenVariants, setChosenVariants] = useState<Record<number, AIVariant>>({})
  const [saved, setSaved] = useState(false)

  const [objective, setObjective] = useState(OBJECTIVES[0])
  const [product, setProduct] = useState(PRODUCTS_MOCK[1])
  const [audience, setAudience] = useState("Mamás del barrio")
  const [tone, setTone] = useState(TONES[2])
  const [frequency, setFrequency] = useState(PERIODS[1])

  async function handleGenerate() {
    setLoading(true)
    setResult(null)
    setChosenVariants({})
    const res = await fetch('/api/generate/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ objective, tone, product, audience, frequency }),
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
      body: JSON.stringify({ planId: result.planId, posts }),
    })
    setSaved(true)
    setTimeout(() => router.push('/plans'), 1000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Crear plan de contenido</h1>
      <p className="text-gray-500 mb-6">Organizá tus redes por un período completo.</p>

      {!result && (
        <div className="bg-white border rounded-lg p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Objetivo</label>
            <div className="flex flex-col gap-2">
              {OBJECTIVES.map((o) => (
                <label key={o} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="objective"
                    checked={objective === o}
                    onChange={() => setObjective(o)}
                  />
                  <span className="text-sm">{o}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Producto</label>
            <select 
              className="w-full border rounded px-3 py-2 text-sm"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              {PRODUCTS_MOCK.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option>+ Agregar nueva</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Audiencia</label>
            <select 
              className="w-full border rounded px-3 py-2 text-sm"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              {AUDIENCE_MOCK.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
              <option>+ Agregar nueva</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tono de comunicación</label>
            <div className="flex gap-2 flex-wrap">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    tone === t ? 'bg-black text-white border-black' : 'border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <div className="flex gap-2 flex-wrap">
              {PERIODS.map((t) => (
                <button
                  key={t}
                  onClick={() => setFrequency(t)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    frequency === t ? 'bg-black text-white border-black' : 'border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-black text-white py-2 rounded font-medium text-sm disabled:opacity-50"
          >
            {loading ? 'Generando tu plan...' : 'Generar plan'}
          </button>
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
            <button
              onClick={handleSave}
              disabled={saved}
              className="bg-black text-white px-6 py-2 rounded font-medium text-sm disabled:opacity-50"
            >
              {saved ? 'Plan guardado ✓' : 'Guardar plan'}
            </button>
            <button
              onClick={() => setResult(null)}
              className="border px-6 py-2 rounded text-sm"
            >
              Volver a configurar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
