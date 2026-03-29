'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { MonthCalendar } from '@/app/(app)/dashboard/components/MonthCalendar'
import { ContentDetailModal } from '@/components/ui/ContentDetailModal'
import type { CalendarEntry } from '@/lib/types'
import { mapCalendarResponseToUpcomingPosts, type UpcomingPostFromAPI } from '@/lib/services/dashboard'

type PlanCalendarModalProps = {
  isOpen: boolean
  onClose: () => void
  planTitle: string
  entries: CalendarEntry[]
}

export function PlanCalendarModal({ isOpen, onClose, planTitle, entries }: PlanCalendarModalProps) {
  const [selectedPost, setSelectedPost] = useState<UpcomingPostFromAPI | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Convertimos las entries del plan al formato que espera MonthCalendar
  const posts = mapCalendarResponseToUpcomingPosts({ entries })

  const handleSelectPost = (post: UpcomingPostFromAPI) => {
    setSelectedPost(post)
    setIsDetailOpen(true)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Calendario: ${planTitle}`}
        className="max-w-4xl"
      >
        <div className="py-2">
          <MonthCalendar 
            posts={posts} 
            onSelectPost={handleSelectPost}
          />
        </div>
      </Modal>

      <ContentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        content={selectedPost ? {
          image: "https://placehold.co/600x400",
          imageAlt: "",
          date: selectedPost.date,
          title: planTitle,
          description: (selectedPost.copy || '') + (selectedPost.imageSuggestion ? `\n\nSugerencia IA: ${selectedPost.imageSuggestion}` : ''),
          socialNetwork: selectedPost.socialNetwork,
          format: selectedPost.type
        } : null}
      />
    </>
  )
}
