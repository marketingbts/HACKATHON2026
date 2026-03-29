import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { AppShell } from './components/AppShell'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const { data: business } = await supabase
    .from('businesses')
    .select('name')
    .eq('user_id', session.userId)
    .maybeSingle()

  if (!business) redirect('/onboarding')

  return <AppShell brandName={business.name}>{children}</AppShell>
}
