import { Link } from 'react-router'
import { CalendarDays, MapPin } from 'lucide-react'
import { Badge, Photo } from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import { eventPrice, eventWhen, EVENT_CATEGORY_LABEL } from '../services/eventFormat'
import type { Event } from '../types'

/** Tarjeta de evento: imagen, restaurante, fecha/hora, descripción y CTA. */
export function EventCard({ event, restaurantName }: { event: Event; restaurantName?: string }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <Photo
        {...responsiveImage(event.image, {
          ratio: '16/9',
          sizes: '(min-width: 1024px) 45vw, 100vw',
        })}
        ratio="16/9"
        zoomOnHover
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
          <span className="text-small font-semibold text-ink">{eventPrice(event)}</span>
        </div>
        <h2 className="text-h3 font-semibold text-ink">
          <Link
            to={`/eventos/${event.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h2>
        <p className="flex items-start gap-1.5 text-small text-ink">
          <CalendarDays aria-hidden size={16} className="mt-0.5 shrink-0 text-ink-muted" />
          <time dateTime={event.startsAt}>{eventWhen(event)}</time>
        </p>
        {restaurantName && (
          <p className="flex items-center gap-1.5 text-small text-ink-muted">
            <MapPin aria-hidden size={16} className="shrink-0" />
            {restaurantName}
          </p>
        )}
        <p className="text-small text-ink-muted">{event.summary}</p>
        <span className="pt-1 text-small font-semibold text-accent-text underline decoration-accent-text/35 decoration-2 underline-offset-[6px] group-hover:decoration-accent-text">
          Ver detalles del evento
        </span>
      </div>
    </article>
  )
}
