import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const cookieHeader = cookies().toString()
  const host = headers().get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  const res = await fetch(`${protocol}://${host}/api/business`, {
    headers: { cookie: cookieHeader },
  })

  if (res.status === 401) redirect('/login')
  if (res.status === 404) redirect('/onboarding')

  return <>{children}</>
}
