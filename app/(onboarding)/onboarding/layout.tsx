import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', session.userId)
    .maybeSingle()

  if (business) redirect('/dashboard')

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
