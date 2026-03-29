import Image from 'next/image'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  if (session) {
    const { data: business } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', session.userId)
      .maybeSingle()

    redirect(business ? '/dashboard' : '/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Marki</h1>
          <Image
            src="/assets/icons/marki/marki-icon-4.png"
            alt=""
            width={28}
            height={28}
            className="h-10 w-10 shrink-0 object-contain"
            priority
          />
        </div>
        {children}
      </div>
    </div>
  )
}
