import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  CreateContentPlanRequest, 
  GeneratePlanResponse, 
  SaveContentPlanRequest, 
  ContentPlanResponse 
} from '@/lib/types'

export function useGeneratePlan() {
  return useMutation<GeneratePlanResponse, Error, CreateContentPlanRequest & { feedback?: string, previousPlan?: any }>({
    mutationFn: async (params) => {
      const res = await fetch('/api/generate/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al generar el plan')
      }
      return res.json()
    }
  })
}

export function useSavePlan() {
  const queryClient = useQueryClient()
  return useMutation<ContentPlanResponse, Error, SaveContentPlanRequest>({
    mutationFn: async (params) => {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al guardar el plan')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] })
    }
  })
}

export function usePlans(status?: 'active' | 'archived') {
  return useQuery<ContentPlanResponse[]>({
    queryKey: ['plans', status],
    queryFn: async () => {
      const url = status ? `/api/plans?status=${status}` : '/api/plans'
      const res = await fetch(url)
      if (!res.ok) throw new Error('Error al cargar planes')
      return res.json()
    }
  })
}