import { useState } from 'react'
import { CalendarX } from 'lucide-react'
import { Chip, EmptyState, ErrorState, PageHeader, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { restaurantRepository } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { EventCard } from '../components/EventCard'
import { EVENT_CATEGORY_LABEL } from '../services/eventFormat'
import { eventRepository } from '../services/eventRepository'
import type { EventCategory } from '../types'

export function EventsPage() {
  const now = useNow()
  const [category, setCategory] = useState<EventCategory | null>(null)
  const data = useAsync(
    () => Promise.all([eventRepository.getUpcoming(now), restaurantRepository.getAll()]),

    [],
  )
  const names = new Map(data.data?.[1].map((r) => [r.id, r.name]))
  const events = (data.data?.[0] ?? []).filter((e) => !category || e.category === category)
  const categories = Object.entries(EVENT_CATEGORY_LABEL) as [EventCategory, string][]

  return (
    <div className="container-page pb-8">
      <Seo
        title="Eventos cubanos en Mérida"
        description="Son en vivo, clases de salsa, degustaciones y talleres en restaurantes cubanos de Mérida."
        path="/eventos"
      />
      <PageHeader
        title="Eventos"
        description="Música en vivo, clases y degustaciones en restaurantes cubanos. Solo mostramos eventos que aún no terminan."
      />
      <div
        role="radiogroup"
        aria-label="Tipo de evento"
        className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 pb-8 tablet:mx-0 tablet:px-0"
      >
        <Chip mode="radio" selected={category === null} onClick={() => setCategory(null)}>
          Todos
        </Chip>
        {categories.map(([id, label]) => (
          <Chip key={id} mode="radio" selected={category === id} onClick={() => setCategory(id)}>
            {label}
          </Chip>
        ))}
      </div>

      {data.status === 'loading' && (
        <div aria-hidden className="grid gap-10 tablet:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      )}
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar los eventos." onRetry={data.reload} />
      )}
      {data.status === 'success' &&
        (events.length === 0 ? (
          <EmptyState
            icon={CalendarX}
            title="No hay eventos próximos de este tipo."
            description="Prueba con otra categoría o vuelve pronto."
          />
        ) : (
          <ul className="grid gap-x-8 gap-y-14 tablet:grid-cols-2">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} restaurantName={names.get(event.restaurantId)} />
              </li>
            ))}
          </ul>
        ))}
    </div>
  )
}
