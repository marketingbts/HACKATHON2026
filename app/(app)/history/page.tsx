import { headers, cookies } from 'next/headers'
import { HistorialClient } from './components/HistorialClient'
import type { ContentPlan, CalendarEntry, QuickGeneration } from '@/lib/types'

export default async function HistorialPage() {
  const cookieHeader = cookies().toString()
  const host = headers().get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const base = `${protocol}://${host}`

  const [plansRes, calendarRes, quickRes] = await Promise.all([
    fetch(`${base}/api/plans`, { headers: { cookie: cookieHeader } }),
    fetch(`${base}/api/calendar`, { headers: { cookie: cookieHeader } }),
    fetch(`${base}/api/quick-generations`, { headers: { cookie: cookieHeader } }),
  ])

  const plans: ContentPlan[] = plansRes.ok ? await plansRes.json() : []
  const calendarData = calendarRes.ok ? await calendarRes.json() : { entries: [], planEntries: [], quickEntries: [] }
  const calendarEntries: CalendarEntry[] = calendarData.entries ?? []
  const quickGenerations: QuickGeneration[] = quickRes.ok ? await quickRes.json() : []

  return (
    <HistorialClient 
      plans={plans} 
      calendarEntries={calendarEntries} 
      quickGenerations={quickGenerations} 
    />
  )
}
