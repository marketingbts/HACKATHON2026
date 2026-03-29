// lib/mock/dashboard.ts

export const MOCK_BRAND = {
  name: 'Panadería El Sol',
  logoUrl: undefined as string | undefined,
  socialNetworks: ['instagram', 'facebook', 'tiktok'] as const,
}

export type PostType = 'Reel' | 'Historia' | 'Publicación'
export type SocialNetwork = 'Instagram' | 'Facebook' | 'TikTok'

export type UpcomingPost = {
  id: string
  date: string        // "2 Abril"
  time: string        // "10:00 AM"
  planName: string    // "Lanzamiento Otoño"
  type: PostType
  socialNetwork: SocialNetwork
}

export const MOCK_UPCOMING_POSTS: UpcomingPost[] = [
  { id: '1', date: '2 Abril',  time: '10:00 AM', planName: 'Lanzamiento Otoño',       type: 'Reel',        socialNetwork: 'Instagram' },
  { id: '2', date: '2 Abril',  time: '2:00 PM',  planName: 'Taller de Diseño',        type: 'Historia',    socialNetwork: 'Instagram' },
  { id: '3', date: '3 Abril',  time: '1:00 PM',  planName: 'Evento de caridad',       type: 'Historia',    socialNetwork: 'Instagram' },
  { id: '4', date: '4 Abril',  time: '11:00 AM', planName: 'Lanzamiento de Producto', type: 'Reel',        socialNetwork: 'Instagram' },
  { id: '5', date: '6 Abril',  time: '3:30 PM',  planName: 'Evento de caridad',       type: 'Historia',    socialNetwork: 'Instagram' },
  { id: '6', date: '7 Abril',  time: '9:00 AM',  planName: 'Evento de caridad',       type: 'Publicación', socialNetwork: 'Instagram' },
]

// Toggle for dev: set to `[]` to see Empty State
export const MOCK_DASHBOARD_STATE: 'empty' | 'filled' =
  MOCK_UPCOMING_POSTS.length === 0 ? 'empty' : 'filled'
