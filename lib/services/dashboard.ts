import { useQuery } from '@tanstack/react-query'
import { getPlanObjectiveLabel } from '@/lib/utils'

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
  date: string | null // YYYY-MM-DD
  planId: string | null
  planObjective: string | null
  postId: string
  network: string | null
  format: string | null
  copy: string | null
  imageSuggestion: string | null
  source?: 'plan' | 'quick'
}

export interface CalendarResponse {
  entries: CalendarEntry[]
  planEntries?: CalendarEntry[]
  quickEntries?: CalendarEntry[]
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
  date: string // Formateada: "lunes, 30 mar"
  isoDate: string // Original: "2026-03-30"
  time?: string
  planName: string
  type: PostType
  socialNetwork: SocialNetwork
  copy?: string
  imageSuggestion?: string
  source?: 'plan' | 'quick'
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
    date: formatLocalDay(entry.date ?? ''),
    isoDate: entry.date ?? '',
    time: undefined,
    planName: entry.source === 'plan' ? getPlanObjectiveLabel(entry.planObjective) : 'Generación Rápida',
    type: (entry.format ? entry.format.charAt(0).toUpperCase() + entry.format.slice(1) : 'Post') as PostType,
    socialNetwork: (entry.network ? entry.network.charAt(0).toUpperCase() + entry.network.slice(1) : 'Instagram') as SocialNetwork,
    copy: entry.copy ?? '',
    imageSuggestion: entry.imageSuggestion ?? '',
    source: entry.source
  }))
}
