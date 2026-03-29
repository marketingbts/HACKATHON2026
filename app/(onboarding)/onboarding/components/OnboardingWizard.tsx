'use client'

import { useState } from 'react'
import { StepIndicator } from './StepIndicator'
import { StepBusiness, type BusinessFormData } from './StepBusiness'
import { StepAudiences, type AudienceFormData } from './StepAudiences'
import { StepProducts, type ProductFormData } from './StepProducts'
import { useOnboardingSubmit } from '@/lib/services/onboarding'

const STEPS = ['Negocio', 'Audiencias', 'Productos']

export function OnboardingWizard() {
  const [step, setStep] = useState(0)
  const [business, setBusiness] = useState<BusinessFormData>({ name: '', industry: '', description: '', socialNetworks: [] })
  const [businessErrors, setBusinessErrors] = useState<Record<string, string>>({})
  const [audiences, setAudiences] = useState<AudienceFormData[]>([])
  const [products, setProducts] = useState<ProductFormData[]>([])

  const { mutate: submitOnboarding, isPending, error } = useOnboardingSubmit()

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

  function handleSubmit(pendingProduct?: ProductFormData) {
    const allProducts = pendingProduct ? [...products, pendingProduct] : products
    submitOnboarding({ business, audiences, products: allProducts })
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
            isSubmitting={isPending}
            submitError={error?.message ?? null}
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
