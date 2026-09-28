import { Link } from 'react-router'
import { Photo } from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import {
  eventDateBlock,
  eventPrice,
  eventWhen,
  EVENT_CATEGORY_LABEL,
} from '../services/eventFormat'
import type { Event } from '../types'

/** Fila de agenda: bloque de fecha + foto + datos. Toda la fila enlaza al evento. */
export function EventAgendaItem({
  event,
  restaurantName,
}: {
  event: Event
  restaurantName?: string
}) {
  const date = eventDateBlock(event)
  return (
    <article className="group relative grid grid-cols-[4.5rem_1fr] items-start gap-4 tablet:grid-cols-[5rem_8rem_1fr] tablet:items-center tablet:gap-6">
      <time
        dateTime={event.startsAt}
        className="flex flex-col items-center rounded-lg bg-surface-sunken py-3 text-center"
      >
        <span className="text-caption font-semibold text-accent-text">{date.weekday}</span>
        <span className="font-display text-h1 leading-none font-bold text-ink">{date.day}</span>
        <span className="text-caption text-ink-muted">{date.month}</span>
      </time>
      <Photo
        {...responsiveImage(event.image, { ratio: '1/1', sizes: '8rem', widths: [256, 384] })}
        ratio="1/1"
        frameClassName="hidden tablet:block"
        zoomOnHover
      />
      <div className="flex flex-col gap-1">
        <p className="text-caption font-semibold text-ink-muted">
          {EVENT_CATEGORY_LABEL[event.category]}
        </p>
        <h3 className="text-h3 font-semibold text-ink">
          <Link
            to={`/eventos/${event.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {event.title}
          </Link>
        </h3>
        <p className="text-small text-ink-muted">{eventWhen(event)}</p>
        <p className="text-small text-ink">
          {restaurantName && <span>{restaurantName} · </span>}
          <span className="font-semibold">{eventPrice(event)}</span>
        </p>
      </div>
    </article>
  )
}
