'use client'

import { useState } from 'react'
import type { GenerateQuickResponse, AIVariant } from '@/lib/types'

const FORMATS = ['post', 'reel', 'carrusel', 'historia']

export default function GeneratePage() {
  const [format, setFormat] = useState('post')
  const [detail, setDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateQuickResponse | null>(null)
  const [chosen, setChosen] = useState<AIVariant | null>(null)
  const [saved, setSaved] = useState(false)

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
      <h1 className="text-2xl font-bold mb-1">Generación rápida</h1>
      <p className="text-gray-500 mb-6">Generá un post o ad puntual sin crear un plan completo.</p>

      {!chosen && (
        <div className="bg-white border rounded-lg p-6 flex flex-col gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Formato</label>
            <div className="flex gap-2 flex-wrap">
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-1.5 rounded-full text-sm border ${
                    format === f ? 'bg-black text-white border-black' : 'border-gray-300'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Producto a destacar</label>
            <select className="w-full border rounded px-3 py-2 text-sm">
              <option>Medialunas artesanales</option>
              <option>Pan de masa madre</option>
              <option>+ Agregar nuevo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Audiencia</label>
            <select className="w-full border rounded px-3 py-2 text-sm">
              <option>Mamás del barrio</option>
              <option>+ Agregar nueva</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Detalles adicionales <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Ej: es jueves, mañana hay feriado"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-black text-white py-2 rounded font-medium text-sm disabled:opacity-50"
          >
            {loading ? 'Generando tu contenido...' : 'Generar'}
          </button>
        </div>
      )}

      {/* Variantes en memoria */}
      {result && !chosen && (
        <div>
          <h2 className="font-semibold mb-3">Elegí una variante</h2>
          <div className="flex flex-col gap-4">
            {result.variants.map((v) => (
              <div key={v.variant} className="bg-white border rounded-lg p-5">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded">
                    Variante {v.variant}
                  </span>
                  <button
                    onClick={() => setChosen(v)}
                    className="text-sm bg-black text-white px-4 py-1 rounded"
                  >
                    Elegir esta
                  </button>
                </div>
                <p className="text-sm mb-3 whitespace-pre-wrap">{v.copy}</p>
                <p className="text-xs text-gray-400 italic">📷 {v.imageSuggestion}</p>
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            className="mt-4 text-sm underline text-gray-500"
          >
            Generar otras variantes
          </button>
        </div>
      )}

      {/* Variante elegida */}
      {chosen && (
        <div className="bg-white border rounded-lg p-6">
          <h2 className="font-semibold mb-3">Tu copy listo para publicar</h2>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm mb-2"
            rows={5}
            defaultValue={chosen.copy}
          />
          <p className="text-xs text-gray-400 italic mb-4">📷 {chosen.imageSuggestion}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(chosen.copy)}
              className="border px-4 py-2 rounded text-sm"
            >
              Copiar
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className="bg-black text-white px-4 py-2 rounded text-sm disabled:opacity-50"
            >
              {saved ? 'Guardado ✓' : 'Guardar en mis planes'}
            </button>
            <button
              onClick={() => { setChosen(null); setResult(null) }}
              className="text-sm underline text-gray-500"
            >
              Volver a generar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
