import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import type { BusinessFormData } from '@/app/(onboarding)/onboarding/components/StepBusiness'
import type { AudienceFormData } from '@/app/(onboarding)/onboarding/components/StepAudiences'
import type { ProductFormData } from '@/app/(onboarding)/onboarding/components/StepProducts'

export type OnboardingData = {
  business: BusinessFormData
  audiences: AudienceFormData[]
  products: ProductFormData[]
}

async function submitOnboarding({ business, audiences, products }: OnboardingData) {
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
  if (products.length > 0) {
    await Promise.allSettled(
      products.map((p) =>
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

  // businessId queda disponible si en el futuro se necesita en onSuccess
  return { businessId }
}

export function useOnboardingSubmit() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: submitOnboarding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business'] })
      router.push('/dashboard')
    },
  })
}
