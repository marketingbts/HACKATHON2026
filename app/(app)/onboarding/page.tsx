'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = ['Tu negocio', 'Audiencias', 'Productos']
const SOCIAL_NETS = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const router = useRouter()

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">Contanos sobre tu negocio</h1>
      <p className="text-gray-500 mb-6">Esta información se usa para personalizar todo el contenido.</p>

      {/* Indicador de paso */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm ${i === step ? 'font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <span className="text-gray-300 mx-1">→</span>}
          </div>
        ))}
      </div>

      {/* Paso 1: Negocio */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del negocio *</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Ej: La Esquina de María" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rubro *</label>
            <input className="w-full border rounded px-3 py-2" placeholder="Ej: Panadería artesanal" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción breve *</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Contanos de qué se trata tu negocio..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Redes sociales donde tenés presencia</label>
            <div className="flex gap-3 flex-wrap">
              {SOCIAL_NETS.map((net) => (
                <label key={net} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" />
                  <span className="text-sm">{net}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paso 2: Audiencias */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">¿A quiénes le vendés? Podés agregar más de una audiencia.</p>
          <div className="border rounded-lg p-4 flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre de la audiencia</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Ej: Mamás del barrio" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
                placeholder="Edad, intereses, comportamiento..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ubicación</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Ej: Palermo, Buenos Aires" />
            </div>
          </div>
          <button className="text-sm underline text-gray-500 text-left">+ Agregar otra audiencia</button>
        </div>
      )}

      {/* Paso 3: Productos */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">¿Qué vendés? Cargá al menos un producto o servicio.</p>
          <div className="border rounded-lg p-4 flex flex-col gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del producto/servicio *</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Ej: Medialunas artesanales" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={2}
                placeholder="¿Qué es? ¿Qué incluye? ¿Cuánto cuesta?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">¿Qué lo hace especial?</label>
              <input className="w-full border rounded px-3 py-2" placeholder="Ej: Receta de la abuela, sin conservantes" />
            </div>
          </div>
          <button className="text-sm underline text-gray-500 text-left">+ Agregar otro producto</button>
        </div>
      )}

      {/* Navegación */}
      <div className="flex justify-between mt-8">
        {step > 0 ? (
          <button onClick={() => setStep(step - 1)} className="text-sm underline text-gray-500">
            Atrás
          </button>
        ) : (
          <div />
        )}
        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="bg-black text-white px-6 py-2 rounded font-medium text-sm"
          >
            Siguiente
          </button>
        ) : (
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-black text-white px-6 py-2 rounded font-medium text-sm"
          >
            Guardar y empezar
          </button>
        )}
      </div>
    </div>
  )
}
