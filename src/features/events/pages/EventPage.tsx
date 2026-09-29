import { Link, useParams } from 'react-router'
import { CalendarDays, CalendarPlus, CalendarX, MapPin, MessageCircle, Ticket } from 'lucide-react'
import {
  Badge,
  Breadcrumbs,
  buttonStyles,
  ButtonContent,
  EmptyState,
  ErrorState,
  Photo,
  ShareButton,
  Skeleton,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { responsiveImage } from '@/shared/lib/images'
import { absoluteUrl } from '@/shared/lib/site'
import { contactLinks, restaurantRepository } from '@/features/restaurants'
import { eventJsonLd, Seo } from '@/features/seo'
import { cityName } from '@/features/zones'
import { eventToICS, icsHref } from '../services/calendar'
import { eventPrice, eventWhen, EVENT_CATEGORY_LABEL } from '../services/eventFormat'
import { eventRepository, isUpcomingEvent } from '../services/eventRepository'

export function EventPage() {
  const { slug = '' } = useParams()
  const now = useNow()
  const data = useAsync(async () => {
    const event = await eventRepository.getBySlug(slug)
    const all = event ? await restaurantRepository.getAll() : []
    return { event, restaurant: all.find((r) => r.id === event?.restaurantId) }
  }, [slug])

  if (data.status === 'loading')
    return (
      <div aria-hidden className="container-page flex flex-col gap-6 pt-8">
        <Skeleton className="aspect-[21/9] rounded-lg" />
        <Skeleton className="h-10 w-2/3" />
      </div>
    )
  if (data.status === 'error')
    return (
      <div className="container-page py-12">
        <ErrorState title="No pudimos cargar este evento." onRetry={data.reload} />
      </div>
    )

  const { event, restaurant } = data.data
  if (!event)
    return (
      <div className="container-page py-12">
        <title>Evento no encontrado | Sabor Cubano</title>
        <EmptyState
          icon={CalendarX}
          headingLevel="h1"
          title="No encontramos este evento."
          action={
            <Link to="/eventos" className={buttonStyles({ variant: 'secondary' })}>
              Ver la agenda
            </Link>
          }
        />
      </div>
    )

  const upcoming = isUpcomingEvent(event, now)
  const city = restaurant ? cityName(restaurant.address.cityId) : ''
  const path = `/eventos/${event.slug}`
  const location = restaurant ? `${restaurant.name}, ${restaurant.address.street}, ${city}` : ''
  const whatsapp = restaurant ? contactLinks(restaurant).whatsapp : undefined

  return (
    <div className="container-page pt-6 pb-10">
      <Seo
        title={event.title}
        description={`${event.summary} ${eventWhen(event)}${restaurant ? ` en ${restaurant.name}, ${city}` : ''}.`}
        path={path}
        image={event.image}
        type="article"
        jsonLd={eventJsonLd(event, restaurant, city)}
      />
      <Breadcrumbs
        items={[
          {
            label: 'Eventos',
            link: (
              <Link to="/eventos" className="hover:text-ink hover:underline">
                Eventos
              </Link>
            ),
          },
          { label: event.title },
        ]}
      />
      <div className="mt-6">
        <Photo
          {...responsiveImage(event.image, { ratio: '21/9', sizes: '100vw' })}
          ratio="21/9"
          priority
          frameClassName="rounded-xl"
        />
      </div>

      <div className="grid gap-10 pt-8 desktop:grid-cols-[1fr_22rem] desktop:gap-16">
        <div className="flex max-w-prose flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <Badge tone="brand">{EVENT_CATEGORY_LABEL[event.category]}</Badge>
            {event.isDemo && <Badge tone="demo">Evento demo</Badge>}
          </div>
          <h1 className="text-h1 font-bold text-ink">{event.title}</h1>
          {!upcoming && (
            <p role="status" className="rounded-md bg-status-closed-soft p-3 text-small text-ink">
              Este evento ya pasó. Revisa la agenda para ver los próximos.
            </p>
          )}
          <p className="text-lead text-ink">{event.description}</p>
        </div>

        <aside className="flex flex-col gap-4 desktop:sticky desktop:top-24 desktop:self-start">
          <dl className="flex flex-col gap-4 rounded-lg bg-surface-sunken p-5">
            <div>
              <dt className="sr-only">Fecha y hora</dt>
              <dd className="flex gap-3 text-body font-semibold text-ink">
                <CalendarDays aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                <time dateTime={event.startsAt}>{eventWhen(event)}</time>
              </dd>
            </div>
            {restaurant && (
              <div>
                <dt className="sr-only">Lugar</dt>
                <dd className="flex gap-3 text-body text-ink">
                  <MapPin aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                  <span>
                    <Link
                      to={`/restaurantes/${restaurant.slug}`}
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {restaurant.name}
                    </Link>
                    <span className="block text-small text-ink-muted">{city}</span>
                  </span>
                </dd>
              </div>
            )}
            <div>
              <dt className="sr-only">Precio</dt>
              <dd className="flex gap-3 text-body font-semibold text-ink">
                <Ticket aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
                {eventPrice(event)}
              </dd>
            </div>
          </dl>
          {upcoming && (
            <div className="flex flex-col gap-2">
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className={buttonStyles({ fullWidth: true })}
                >
                  <ButtonContent leadingIcon={MessageCircle}>{event.ctaLabel}</ButtonContent>
                </a>
              ) : (
                restaurant && (
                  <Link
                    to={`/restaurantes/${restaurant.slug}`}
                    className={buttonStyles({ fullWidth: true })}
                  >
                    Ver restaurante
                  </Link>
                )
              )}
              <a
                href={icsHref(eventToICS(event, location, absoluteUrl(path)))}
                download={`${event.slug}.ics`}
                className={buttonStyles({ variant: 'ghost', fullWidth: true })}
              >
                <ButtonContent leadingIcon={CalendarPlus}>Agregar a mi calendario</ButtonContent>
              </a>
              <ShareButton
                title={event.title}
                text={event.summary}
                url={absoluteUrl(path)}
                className="w-full"
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
