import { Link } from 'react-router'
import { EmptyState, ErrorState, Section, Skeleton, textLinkClass } from '@/shared/design-system'
import { CalendarX } from 'lucide-react'
import { useAsync } from '@/shared/hooks/useAsync'
import { restaurantRepository } from '@/features/restaurants'
import { eventRepository } from '../services/eventRepository'
import { EventAgendaItem } from './EventAgendaItem'

export function UpcomingEvents({ now, limit = 3 }: { now: Date; limit?: number }) {
  const data = useAsync(
    () => Promise.all([eventRepository.getUpcoming(now), restaurantRepository.getAll()]),
    // Se consulta una vez por visita; el minuto actual no cambia la agenda.

    [],
  )
  const names = new Map(data.data?.[1].map((r) => [r.id, r.name]))
  const events = data.data?.[0].slice(0, limit) ?? []

  return (
    <Section
      title="Próximos eventos"
      description="Son en vivo, clases de salsa y degustaciones en restaurantes cubanos."
      tone="sunken"
      action={
        <Link to="/eventos" className={textLinkClass}>
          Ver agenda completa
        </Link>
      }
    >
      {data.status === 'loading' && (
        <div aria-hidden className="flex flex-col gap-6">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
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
            title="No hay eventos próximos por ahora."
            description="Vuelve pronto: los restaurantes publican su agenda cada semana."
          />
        ) : (
          <ol className="flex flex-col gap-8">
            {events.map((event) => (
              <li key={event.id}>
                <EventAgendaItem event={event} restaurantName={names.get(event.restaurantId)} />
              </li>
            ))}
          </ol>
        ))}
    </Section>
  )
}
