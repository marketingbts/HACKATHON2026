import { useQuery } from '@tanstack/react-query'
export type SocialNetwork = 'Instagram' | 'Facebook' | 'TikTok' | 'WhatsApp'
export type PostType = 'Historia' | 'Reel' | 'Post' | 'Carrusel'

export interface BusinessResponse {
  id: string
  userId: string
  name: string
  industry: string
  description: string
  colors: string | null
  logoUrl: string | null
  typography: string | null
  socialNetworks: string[]
  createdAt: string
  updatedAt: string
}

export interface CalendarEntry {
  date: string // YYYY-MM-DD
  planId: string
  planObjective: string
  postId: string
  network: string
  format: string
  copy: string
  imageSuggestion: string | null
}

export interface CalendarResponse {
  entries: CalendarEntry[]
}

export function useBusiness() {
  return useQuery<BusinessResponse>({
    queryKey: ['business'],
    queryFn: async () => {
      const res = await fetch('/api/business')
      if (res.status === 404) {
        throw new Error('Not Found')
      }
      if (!res.ok) {
        throw new Error('Failed to fetch business')
      }
      return res.json()
    },
  })
}

export function useCalendar() {
  return useQuery<CalendarResponse>({
    queryKey: ['calendar'],
    queryFn: async () => {
      const res = await fetch('/api/calendar')
      if (!res.ok) {
        throw new Error('Failed to fetch calendar data')
      }
      return res.json()
    },
  })
}

export type UpcomingPostFromAPI = {
  id: string
  date: string
  time?: string
  planName: string
  type: PostType
  socialNetwork: SocialNetwork
}

/**
 * Formatea 'YYYY-MM-DD' a 'Miercoles, 24 oct'
 */
function formatLocalDay(isoDate: string) {
  try {
    const date = new Date(isoDate + 'T12:00:00') // mediodía para evitar saltos de zona horaria
    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    })
    return formatter.format(date)
  } catch {
    return isoDate
  }
}

/**
 * Normaliza las entradas del backend a la estructura usada por la grilla
 */
export function mapCalendarResponseToUpcomingPosts(data: CalendarResponse): UpcomingPostFromAPI[] {
  return data.entries.map((entry) => ({
    id: entry.postId,
    date: formatLocalDay(entry.date),
    time: undefined, // El usuario requirió quitar la hora si no existe
    planName: entry.planObjective,
    type: (entry.format.charAt(0).toUpperCase() + entry.format.slice(1)) as PostType, // "reel" -> "Reel"
    socialNetwork: (entry.network.charAt(0).toUpperCase() + entry.network.slice(1)) as SocialNetwork, // "instagram" -> "Instagram"
  }))
}
