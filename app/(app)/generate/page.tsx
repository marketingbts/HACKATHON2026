'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { GenerateQuickResponse, AIVariant } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { GoalOption } from '@/components/ui/GoalOption'
import { GeneratedContentCard } from '@/components/ui/GeneratedContentCard'
import { Multiselect } from '@/components/ui/Multiselect'
import { ProductModal } from '@/components/ui/ProductModal'
import { AudienceModal } from '@/components/ui/AudienceModal'
import { useAudiences, useProducts } from '@/lib/hooks/use-business'
import { useGenerateQuick, useSaveQuick } from '@/lib/hooks/use-quick-gen'
import { toast } from 'sonner'

const FORMAT_OPTIONS = [
  { value: 'post', label: 'Publicación' },
  { value: 'reel', label: 'Reel' },
  { value: 'carrusel', label: 'Carrusel' },
  { value: 'historia', label: 'Historia' },
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

export default function GeneratePage() {
  const router = useRouter()
  const { data: audiencesList = [] } = useAudiences()
  const { data: productsList = [] } = useProducts()
  const generateQuick = useGenerateQuick()
  const saveQuick = useSaveQuick()

  const [format, setFormat] = useState('post')
  const [detail, setDetail] = useState('')
  const [result, setResult] = useState<GenerateQuickResponse | null>(null)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])
  const [selectedAudienceIds, setSelectedAudienceIds] = useState<string[]>([])
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isAudienceModalOpen, setIsAudienceModalOpen] = useState(false)
  const [initialProductName, setInitialProductName] = useState('')
  const [initialAudienceName, setInitialAudienceName] = useState('')


  const [tone, setTone] = useState('cercano')
  const [objective, setObjective] = useState(GOAL_OPTIONS[0].value)

  const productOptions = productsList.map((p) => ({ value: p.id, label: p.name }))
  const audienceOptions = audiencesList.map((a) => ({ value: a.id, label: a.name }))

  const TONE_OPTIONS = [
    { value: 'formal', label: 'Formal' },
    { value: 'informal', label: 'Informal' },
    { value: 'cercano', label: 'Cercano' },
    { value: 'profesional', label: 'Profesional' },
  ]

  async function handleGenerate() {
    const data = await generateQuick.mutateAsync({ 
      format: format as any, 
      detail,
      productId: selectedProductIds[0], // Quick gen supports 1 at backend currently
      audienceName: audiencesList.find(a => a.id === selectedAudienceIds[0])?.name
    })
    setResult(data)
  }

  async function handleSave(variant: AIVariant) {
    await saveQuick.mutateAsync({ 
      format, 
      detail, 
      copy: variant.copy, 
      imageSuggestion: variant.imageSuggestion,
      productId: selectedProductIds[0],
      audienceName: audiencesList.find(a => a.id === selectedAudienceIds[0])?.name
    })
    toast.success('Contenido guardado exitosamente')
    router.push('/dashboard')
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
          id="select-format"
          label="¿Cómo querés publicarlo?"
          options={FORMAT_OPTIONS}
          value={format}
          onChange={setFormat}
          placeholder="Selecciona como querés publicar contenido"
        />


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
          <Button 
            variant="primary" 
            onClick={handleGenerate} 
            disabled={generateQuick.isPending || selectedProductIds.length === 0 || selectedAudienceIds.length === 0}
          >
              {generateQuick.isPending ? 'Generando tu contenido...' : '✦ Generar contenido'}
            </Button>
        </div>
      </div>

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        initialName={initialProductName}
        onSuccess={(id) => setSelectedProductIds([id])}
      />

      <AudienceModal
        isOpen={isAudienceModalOpen}
        onClose={() => setIsAudienceModalOpen(false)}
        initialName={initialAudienceName}
        onSuccess={(id) => setSelectedAudienceIds([id])}
      />

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
                onCopy={(text) => {
                  if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => toast.success('Copiado al portapapeles'))
                  } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-9999px";
                    textArea.style.top = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      toast.success('Copiado al portapapeles')
                    } catch (err) {
                      console.error('Error al copiar: ', err);
                    }
                    document.body.removeChild(textArea);
                  }
                }}
                onSave={() => handleSave(v)}
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
