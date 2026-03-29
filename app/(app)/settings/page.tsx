'use client'

import { useState, useEffect } from 'react'
import { InputField } from '@/components/ui/InputField'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { BatchSelect } from '@/components/ui/BatchSelect'
import {
  useBusinessSettings,
  useUpdateBusiness,
  useAddAudience,
  useDeleteAudience,
  useAddProduct,
  useDeleteProduct,
} from '@/lib/services/settings'

const SOCIAL_NETS = [
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'WhatsApp', label: 'WhatsApp' },
]

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-border-subtle p-6 flex flex-col gap-5">
      <h2 className="text-base font-semibold text-neutral-950">{title}</h2>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { data, isLoading } = useBusinessSettings()

  const updateBusiness = useUpdateBusiness()
  const addAudience = useAddAudience()
  const deleteAudience = useDeleteAudience()
  const addProduct = useAddProduct()
  const deleteProduct = useDeleteProduct()

  // ── Business form state ──────────────────────────────────────────────────────
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [description, setDescription] = useState('')
  const [socialNetworks, setSocialNetworks] = useState<string[]>([])

  useEffect(() => {
    if (data) {
      setName(data.name)
      setIndustry(data.industry)
      setDescription(data.description)
      setSocialNetworks(data.socialNetworks)
    }
  }, [data])

  // ── Audience inline form ─────────────────────────────────────────────────────
  const [showAudienceForm, setShowAudienceForm] = useState(false)
  const [newAudienceName, setNewAudienceName] = useState('')
  const [newAudienceDesc, setNewAudienceDesc] = useState('')
  const [audienceError, setAudienceError] = useState('')

  function handleAddAudience() {
    if (!newAudienceName.trim()) {
      setAudienceError('Ingresá el nombre de la audiencia')
      return
    }
    addAudience.mutate(
      { name: newAudienceName.trim(), description: newAudienceDesc.trim() || undefined },
      {
        onSuccess: () => {
          setNewAudienceName('')
          setNewAudienceDesc('')
          setAudienceError('')
          setShowAudienceForm(false)
        },
      }
    )
  }

  // ── Product inline form ──────────────────────────────────────────────────────
  const [showProductForm, setShowProductForm] = useState(false)
  const [newProductName, setNewProductName] = useState('')
  const [newProductDesc, setNewProductDesc] = useState('')
  const [productError, setProductError] = useState('')

  function handleAddProduct() {
    if (!newProductName.trim()) {
      setProductError('Ingresá el nombre del producto o servicio')
      return
    }
    addProduct.mutate(
      { name: newProductName.trim(), description: newProductDesc.trim() || undefined },
      {
        onSuccess: () => {
          setNewProductName('')
          setNewProductDesc('')
          setProductError('')
          setShowProductForm(false)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">

      {/* ── Datos del negocio ── */}
      <SectionCard title="Datos del negocio">
        <InputField
          id="settings-name"
          label="Nombre del negocio"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          id="settings-industry"
          label="Rubro"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
        <Textarea
          id="settings-description"
          label="¿Qué hace especial a tu negocio?"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <BatchSelect
          label="Redes sociales donde tenés presencia"
          options={SOCIAL_NETS}
          value={socialNetworks}
          onChange={setSocialNetworks}
        />

        {updateBusiness.error && (
          <p className="text-red-500 text-xs">{updateBusiness.error.message}</p>
        )}

        <div className="flex justify-end pt-1">
          <Button
            onClick={() => updateBusiness.mutate({ name, industry, description, socialNetworks })}
            disabled={updateBusiness.isPending}
          >
            {updateBusiness.isPending ? 'Guardando...' : updateBusiness.isSuccess ? 'Guardado ✓' : 'Guardar cambios'}
          </Button>
        </div>
      </SectionCard>

      {/* ── Audiencias ── */}
      <SectionCard title="Audiencias">
        <div className="flex flex-col gap-2">
          {data?.audiences.map((a) => (
            <div key={a.id} className="flex items-center gap-2">
              <div className="flex-1 bg-indigo-50 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-neutral-800">{a.name}</p>
                {a.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">{a.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteAudience.mutate(a.id)}
                disabled={deleteAudience.isPending}
                className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                aria-label={`Eliminar ${a.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {showAudienceForm ? (
          <div className="flex flex-col gap-3 border border-border-subtle rounded-xl p-4">
            <InputField
              id="new-audience-name"
              label="Audiencia"
              placeholder="Ej: Madres de familia del barrio, 30-50 años"
              value={newAudienceName}
              onChange={(e) => setNewAudienceName(e.target.value)}
              className={audienceError ? 'border-red-400' : ''}
            />
            {audienceError && <p className="text-red-500 text-xs -mt-1">{audienceError}</p>}
            <Textarea
              id="new-audience-desc"
              label="¿Qué problema les resolvés?"
              placeholder="Ej: Tienen poco tiempo y quieren desayunos ricos"
              rows={2}
              value={newAudienceDesc}
              onChange={(e) => setNewAudienceDesc(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => { setShowAudienceForm(false); setAudienceError('') }}>
                Cancelar
              </Button>
              <Button onClick={handleAddAudience} disabled={addAudience.isPending}>
                {addAudience.isPending ? 'Guardando...' : 'Agregar'}
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAudienceForm(true)}
            className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-500 hover:text-indigo-700 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <PlusIcon />
            Agregar audiencia
          </button>
        )}
      </SectionCard>

      {/* ── Productos y servicios ── */}
      <SectionCard title="Productos y servicios">
        <div className="flex flex-col gap-2">
          {data?.products.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="flex-1 bg-indigo-50 rounded-xl px-4 py-3">
                <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                {p.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">{p.description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteProduct.mutate(p.id)}
                disabled={deleteProduct.isPending}
                className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                aria-label={`Eliminar ${p.name}`}
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        {showProductForm ? (
          <div className="flex flex-col gap-3 border border-border-subtle rounded-xl p-4">
            <InputField
              id="new-product-name"
              label="Producto o servicio"
              placeholder="Ej: Clases de música personalizadas"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className={productError ? 'border-red-400' : ''}
            />
            {productError && <p className="text-red-500 text-xs -mt-1">{productError}</p>}
            <Textarea
              id="new-product-desc"
              label="¿Qué problema resolvés?"
              placeholder="Ej: Ayudo a mis alumnos a tocar sus canciones favoritas"
              rows={2}
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => { setShowProductForm(false); setProductError('') }}>
                Cancelar
              </Button>
              <Button onClick={handleAddProduct} disabled={addProduct.isPending}>
                {addProduct.isPending ? 'Guardando...' : 'Agregar'}
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowProductForm(true)}
            className="w-full border-2 border-dashed border-indigo-200 hover:border-indigo-400 text-indigo-500 hover:text-indigo-700 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <PlusIcon />
            Agregar producto o servicio
          </button>
        )}
      </SectionCard>

    </div>
  )
}
