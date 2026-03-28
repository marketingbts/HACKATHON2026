'use client'

import { useState } from 'react'

const SOCIAL_NETS = ['instagram', 'facebook', 'tiktok', 'whatsapp']

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/business', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Configuración</h1>
      <p className="text-gray-500 mb-6">Editá la información de tu negocio.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="font-semibold">Datos del negocio</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nombre del negocio</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue="La Esquina de María"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rubro</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue="Panadería artesanal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={3}
              defaultValue="Panadería artesanal en Palermo con recetas familiares y productos sin conservantes."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Redes sociales</label>
            <div className="flex gap-4 flex-wrap">
              {SOCIAL_NETS.map((net) => (
                <label key={net} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={['instagram', 'facebook'].includes(net)}
                  />
                  <span className="text-sm capitalize">{net}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="font-semibold">Audiencias</h2>
          <div className="border rounded p-3">
            <p className="text-sm font-medium">Mamás del barrio</p>
            <p className="text-xs text-gray-500">Mujeres 30-45 · Palermo, Buenos Aires</p>
          </div>
          <button type="button" className="text-sm underline text-gray-500 text-left">
            + Agregar audiencia
          </button>
        </div>

        <div className="bg-white border rounded-lg p-6 flex flex-col gap-4">
          <h2 className="font-semibold">Productos y servicios</h2>
          <div className="flex flex-col gap-2">
            <div className="border rounded p-3">
              <p className="text-sm font-medium">Medialunas artesanales</p>
              <p className="text-xs text-gray-500">Receta de la abuela, sin conservantes</p>
            </div>
            <div className="border rounded p-3">
              <p className="text-sm font-medium">Pan de masa madre</p>
              <p className="text-xs text-gray-500">Sin levadura industrial, proceso artesanal</p>
            </div>
          </div>
          <button type="button" className="text-sm underline text-gray-500 text-left">
            + Agregar producto
          </button>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded font-medium text-sm"
          >
            {saved ? 'Guardado ✓' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
