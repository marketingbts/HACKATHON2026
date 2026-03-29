import { useQuery } from '@tanstack/react-query'
import { Audience, Product } from '@/lib/types'

export function useAudiences() {
  return useQuery<Audience[]>({
    queryKey: ['audiences'],
    queryFn: async () => {
      const res = await fetch('/api/audiences')
      if (!res.ok) throw new Error('Error al cargar audiencias')
      return res.json()
    }
  })
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Error al cargar productos')
      return res.json()
    }
  })
}