import { redirect } from 'next/navigation'
import { headers, cookies } from 'next/headers'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const cookieHeader = cookies().toString()
  const host = headers().get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'

  const res = await fetch(`${protocol}://${host}/api/business`, {
    headers: { cookie: cookieHeader },
  })

  if (res.ok) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-surface-muted flex flex-col">
      <header className="py-5 text-center">
        <span className="text-2xl font-bold text-brand">Marki</span>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        {children}
      </main>
    </div>
  )
}
