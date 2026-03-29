import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  GenerateQuickRequest, 
  GenerateQuickResponse, 
  SaveQuickGenerationRequest, 
  QuickGeneration 
} from '@/lib/types'

export function useGenerateQuick() {
  return useMutation<GenerateQuickResponse, Error, GenerateQuickRequest>({
    mutationFn: async (params) => {
      const res = await fetch('/api/generate/quick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al generar contenido')
      }
      return res.json()
    }
  })
}

export function useSaveQuick() {
  const queryClient = useQueryClient()
  return useMutation<QuickGeneration, Error, SaveQuickGenerationRequest>({
    mutationFn: async (params) => {
      const res = await fetch('/api/quick-generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Error al guardar contenido')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quick-generations'] })
    }
  })
}