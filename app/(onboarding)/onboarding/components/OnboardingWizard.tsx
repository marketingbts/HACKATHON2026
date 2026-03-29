'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StepIndicator } from './StepIndicator'
import { StepBusiness, type BusinessFormData } from './StepBusiness'
import { StepAudiences, type AudienceFormData } from './StepAudiences'
import { StepProducts, type ProductFormData } from './StepProducts'

const STEPS = ['Negocio', 'Audiencias', 'Productos']

export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [business, setBusiness] = useState<BusinessFormData>({ name: '', industry: '', description: '', socialNetworks: [] })
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({})
  const [audiences, setAudiences] = useState<AudienceFormData[]>([])
  const [products, setProducts] = useState<ProductFormData[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function handleBusinessNext() {
    const errors: Record<string, string> = {}
    if (!business.name.trim()) errors.name = 'El nombre del negocio es requerido'
    if (!business.industry.trim()) errors.industry = 'El rubro es requerido'
    if (!business.description.trim()) errors.description = 'Contanos algo sobre tu negocio'
    if (Object.keys(errors).length > 0) {
      setBusinessErrors(errors)
      return
    }
    setBusinessErrors({})
    setStep(1)
  }

  async function handleSubmit(pendingProduct?: ProductFormData) {
    setIsSubmitting(true)
    setSubmitError(null)

    const allProducts = pendingProduct ? [...products, pendingProduct] : products

    try {
      // 1. Crear negocio
      let businessId: string
      const bizRes = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: business.name.trim(),
          industry: business.industry.trim(),
          description: business.description.trim(),
          socialNetworks: business.socialNetworks,
        }),
      })

      if (bizRes.ok) {
        const bizData = await bizRes.json()
        businessId = bizData.id
      } else if (bizRes.status === 409) {
        // Ya existe — obtenerlo
        const getRes = await fetch('/api/business')
        if (!getRes.ok) throw new Error('No se pudo obtener el negocio existente')
        const getData = await getRes.json()
        businessId = getData.id
      } else {
        throw new Error('No se pudo guardar el negocio')
      }

      // 2. Crear audiencias en paralelo (tolerante a fallos)
      if (audiences.length > 0) {
        await Promise.allSettled(
          audiences.map((a) =>
            fetch('/api/audiences', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: a.name,
                description: a.description || undefined,
              }),
            })
          )
        )
      }

      // 3. Crear productos en paralelo (tolerante a fallos)
      if (allProducts.length > 0) {
        await Promise.allSettled(
          allProducts.map((p) =>
            fetch('/api/products', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: p.name,
                differentiator: p.description || undefined,
              }),
            })
          )
        )
      }

      router.push('/dashboard')
    } catch (err) {
      setSubmitError('Ocurrió un error al guardar. Intentalo de nuevo.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-sm px-8 py-8">
        <StepIndicator steps={STEPS} currentStep={step} />

        {step === 0 && (
          <StepBusiness
            data={business}
            errors={businessErrors}
            onChange={setBusiness}
            onNext={handleBusinessNext}
          />
        )}

        {step === 1 && (
          <StepAudiences
            audiences={audiences}
            onAddAudience={(a) => setAudiences((prev) => [...prev, a])}
            onRemoveAudience={(i) => setAudiences((prev) => prev.filter((_, idx) => idx !== i))}
            onBack={() => setStep(0)}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepProducts
            products={products}
            isSubmitting={isSubmitting}
            submitError={submitError}
            onAddProduct={(p) => setProducts((prev) => [...prev, p])}
            onRemoveProduct={(i) => setProducts((prev) => prev.filter((_, idx) => idx !== i))}
            onBack={() => setStep(1)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
