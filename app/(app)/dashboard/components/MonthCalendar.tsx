'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { UpcomingPostFromAPI } from '@/lib/services/dashboard'
import { CalendarList, CalendarRow } from '@/components/ui/CalendarRow'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type MonthCalendarProps = {
  posts: UpcomingPostFromAPI[]
  onSelectPost?: (post: UpcomingPostFromAPI) => void
}

export function MonthCalendar({ posts, onSelectPost }: MonthCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Ajustar para que la semana empiece en Lunes (0 = lunes, 6 = domingo)
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const previousMonthDays = Array.from({ length: startOffset }, (_, i) => {
    const lastDayPrevMonth = new Date(year, month, 0).getDate()
    return lastDayPrevMonth - startOffset + i + 1
  })

  const nextMonthDaysCount = 42 - (days.length + previousMonthDays.length)
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1)

  const monthName = currentDate.toLocaleString('es-AR', { month: 'long' })

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1))
  }

  const getPostsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return []
    const dateStr = new Date(year, month, day).toISOString().split('T')[0]
    
    // El formato en upcomingPosts es "miércoles, 24 oct", necesitamos comparar con algo sólido
    // Para simplificar, buscaremos posts cuya fecha mapeada coincida con el día
    return posts.filter(p => {
        // Esta es una simplificación, idealmente upcomingPosts debería tener la fecha ISO original
        // Como no la tiene, haremos una aproximación por ahora o asumiremos que el Dashboard 
        // pasará los datos con la fecha ISO si es necesario.
        // Pero por ahora vamos a usar una lógica basada en el match del nombre del día/mes si es necesario.
        // ACTUALIZACIÓN: Vamos a pasar los datos originales a mapCalendarResponseToUpcomingPosts
        return false // Implementaremos esto mejor una vez que ajustemos el mapper
    })
  }

  // Usamos isoDate para una comparación exacta y segura
  const hasContentOnDate = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return false
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return posts.some(p => p.isoDate === dateStr)
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-xl">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-bold text-neutral-900 capitalize">
          {monthName} {year}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5 text-neutral-600" />
          </button>
          <button
            onClick={() => changeMonth(1)}
            className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5 text-neutral-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-neutral-100 border border-neutral-100 rounded-xl overflow-hidden shadow-sm">
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
          <div key={d} className="bg-neutral-50 py-3 text-center">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{d}</span>
          </div>
        ))}

        {previousMonthDays.map((d, i) => (
          <div key={`prev-${i}`} className="bg-white min-h-[80px] p-2 opacity-30">
            <span className="text-xs font-medium text-neutral-400">{d}</span>
          </div>
        ))}

        {days.map(d => {
          const hasContent = hasContentOnDate(d, true)
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isToday = new Date().toDateString() === new Date(year, month, d).toDateString()
          const isSelected = selectedDate === dateStr
          
          const dayPosts = posts.filter(p => p.isoDate === dateStr)

          return (
            <div
              key={d}
              onClick={() => setSelectedDate(dateStr)}
              className={cn(
                "bg-white min-h-[90px] p-2 flex flex-col gap-1 transition-colors hover:bg-neutral-50 cursor-pointer border-t border-l border-neutral-50",
                isToday && "bg-brand-50/10",
                isSelected && "ring-2 ring-brand-500 ring-inset bg-brand-50/30"
              )}
            >
              <span className={cn(
                "text-xs font-bold",
                isToday ? "text-brand-600" : "text-neutral-500",
                hasContent && !isToday && "text-neutral-900"
              )}>
                {d}
              </span>
              
              <div className="flex flex-wrap gap-1">
                {dayPosts.map((p, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                        "w-full h-1.5 rounded-full mb-0.5",
                        p.source === 'plan' ? "bg-purple-400" : "bg-blue-400"
                    )}
                    title={p.planName}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {nextMonthDays.map((d, i) => (
          <div key={`next-${i}`} className="bg-white min-h-[80px] p-2 opacity-30">
            <span className="text-xs font-medium text-neutral-400">{d}</span>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 px-2 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
          <span className="text-[11px] font-medium text-neutral-500">Plan Estratégico</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          <span className="text-[11px] font-medium text-neutral-500">Generación Rápida</span>
        </div>
      </div>

      {/* Detalles del día seleccionado */}
      {selectedDate && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900">
              Contenido para el {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </h4>
            <span className="text-xs text-neutral-500">
              {posts.filter(p => p.isoDate === selectedDate).length} publicaciones
            </span>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-1 border border-neutral-100">
            {posts.filter(p => p.isoDate === selectedDate).length > 0 ? (
              <CalendarList>
                {posts.filter(p => p.isoDate === selectedDate).map((post) => (
                  <CalendarRow
                    key={post.id}
                    date={post.date}
                    time={post.time ?? '11:00'}
                    title={post.planName}
                    contentType={post.type}
                    socialNetwork={post.socialNetwork}
                    source={post.source}
                    onClick={() => onSelectPost?.(post)}
                  />
                ))}
              </CalendarList>
            ) : (
              <div className="py-8 text-center">
                <p className="text-sm text-neutral-400">No hay contenido programado para este día.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
