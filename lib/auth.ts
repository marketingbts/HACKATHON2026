import { headers } from 'next/headers'

export interface Session {
  userId: string
}

export async function getSession(): Promise<Session | null> {
  if (process.env.SKIP_AUTH === 'true') {
    return { userId: 'dev-user-id' }
  }

  // TODO: implementar verificación real con Supabase Auth
  const headersList = headers()
  const userId = headersList.get('x-user-id')
  if (!userId) return null

  return { userId }
}
