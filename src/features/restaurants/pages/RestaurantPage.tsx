import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { MapPin, MapPinOff, Phone, MessageCircle } from 'lucide-react'
import {
  Badge,
  Breadcrumbs,
  buttonStyles,
  EmptyState,
  ErrorState,
  Rating,
  Skeleton,
  SkeletonText,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { formatPhone } from '@/shared/lib/contact'
import { absoluteUrl } from '@/shared/lib/site'
import { dishById } from '@/features/dishes'
import { EventAgendaItem, eventRepository } from '@/features/events'
import { MenuView } from '@/features/menu'
import { PromotionTicket, promotionRepository } from '@/features/promotions'
import { breadcrumbJsonLd, restaurantJsonLd, Seo } from '@/features/seo'
import { cityName, cities, neighborhoodName } from '@/features/zones'
import { MobileActionBar, RestaurantActions } from '../components/RestaurantActions'
import { OpenStatusLabel } from '../components/OpenStatusLabel'
import { RestaurantFacts } from '../components/RestaurantFacts'
import { RestaurantGallery } from '../components/RestaurantGallery'
import { SocialLinks } from '../components/SocialLinks'
import { WeeklySchedule } from '../components/WeeklySchedule'
import { cuisineName, priceDescription, priceLabel, typeLabel } from '../services/catalog'
import { contactLinks } from '../services/contactLinks'
import { getOpenStatus } from '../services/openStatus'
import { restaurantRepository } from '../services/restaurantRepository'
import type { Restaurant } from '../types'

function Block({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id ?? title}-titulo`}
      className="flex scroll-mt-28 flex-col gap-5"
    >
      <h2 id={`${id ?? title}-titulo`} className="text-h2 font-bold text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ProfileSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-8 pt-6">
      <Skeleton className="h-5 w-64" />
      <div className="grid gap-2 tablet:grid-cols-[2fr_1fr_1fr]">
        <Skeleton className="aspect-[4/3] rounded-lg tablet:row-span-2" />
        <Skeleton className="hidden aspect-square rounded-lg tablet:block" />
        <Skeleton className="hidden aspect-square rounded-lg tablet:block" />
      </div>
      <Skeleton className="h-12 w-2/3" />
      <SkeletonText lines={3} className="max-w-xl" />
    </div>
  )
}

function RestaurantProfile({ restaurant: r, now }: { restaurant: Restaurant; now: Date }) {
  const status = getOpenStatus(r.schedule, r.specialSchedules, now)
  const city = cityName(r.address.cityId)
  const neighborhood = neighborhoodName(r.address.neighborhoodId)
  const citySlug = cities.find((c) => c.id === r.address.cityId)?.slug ?? ''
  const extras = useAsync(
    () =>
      Promise.all([
        promotionRepository.getByRestaurant(r.id, now),
        eventRepository.getByRestaurant(r.id, now),
      ]),

    [r.id],
  )
  const [promotions = [], events = []] = extras.data ?? []
  const links = contactLinks(r)
  const path = `/restaurantes/${r.slug}`

  return (
    <>
      <Seo
        title={`${r.name}: ${typeLabel(r.type).toLowerCase()} cubano en ${neighborhood}, ${city}`}
        description={`${r.tagline} Horarios, menú, fotos, ubicación y contacto de ${r.name} en ${city}.`}
        path={path}
        image={r.cover}
        type="restaurant"
        jsonLd={[
          restaurantJsonLd(r, city, neighborhood),
          breadcrumbJsonLd([
            { name: 'Restaurantes', path: '/restaurantes' },
            { name: city, path: `/zonas/${citySlug}` },
            { name: r.name, path },
          ]),
        ]}
      />

      <div className="flex flex-col gap-6 pt-6">
        <Breadcrumbs
          items={[
            {
              label: 'Restaurantes',
              link: (
                <Link to="/restaurantes" className="hover:text-ink hover:underline">
                  Restaurantes
                </Link>
              ),
            },
            {
              label: city,
              link: (
                <Link to={`/zonas/${citySlug}`} className="hover:text-ink hover:underline">
                  {city}
                </Link>
              ),
            },
            { label: r.name },
          ]}
        />
        <RestaurantGallery images={r.gallery} name={r.name} />
      </div>

      <div className="grid gap-12 pt-8 pb-16 desktop:grid-cols-[1fr_22rem] desktop:gap-16">
        <div className="flex min-w-0 flex-col gap-14">
          <header className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{typeLabel(r.type)}</Badge>
              {r.cuisineIds.map((id) => (
                <Badge key={id} tone="neutral">
                  {cuisineName(id)}
                </Badge>
              ))}
              {r.isDemo && (
                <Badge tone="demo" title="Nombre, dirección, horarios y contacto son ficticios">
                  Datos demo
                </Badge>
              )}
            </div>
            <h1 className="text-h1 font-bold text-ink">{r.name}</h1>
            <p className="max-w-prose text-lead text-ink-muted">{r.tagline}</p>
            <div className="flex flex-col gap-2">
              <OpenStatusLabel status={status} size="md" />
              {status.specialLabel && (
                <p className="pl-6 text-small text-ink-muted">Aviso: {status.specialLabel}.</p>
              )}
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-body text-ink-muted">
                {r.rating && <Rating value={r.rating.average} count={r.rating.count} size="md" />}
                <span>
                  <span className="font-semibold text-ink">{priceLabel(r.priceLevel)}</span>{' '}
                  {priceDescription(r.priceLevel).toLowerCase()}
                </span>
              </p>
              <p className="flex items-start gap-1.5 text-body text-ink-muted">
                <MapPin aria-hidden size={18} className="mt-1 shrink-0" />
                <span>
                  {r.address.street}, {neighborhood}, {city}
                  {r.address.reference && (
                    <span className="text-small"> ({r.address.reference})</span>
                  )}
                </span>
              </p>
            </div>
            <div className="hidden pt-2 tablet:block">
              <RestaurantActions restaurant={r} shareUrl={absoluteUrl(path)} />
            </div>
          </header>

          <Block title="Sobre el lugar">
            <p className="max-w-prose text-body text-ink">{r.description}</p>
          </Block>

          <Block id="menu" title="Menú">
            <MenuView menu={r.menu} restaurantName={r.name} dishSlug={(id) => dishById(id)?.slug} />
          </Block>

          <Block title="Todo lo que necesitas saber">
            <RestaurantFacts facts={r.facts} serviceIds={r.serviceIds} />
          </Block>

          {promotions.length > 0 && (
            <Block title="Promociones">
              <div className="grid gap-4">
                {promotions.map((p) => (
                  <PromotionTicket key={p.id} promotion={p} now={now} showConditions />
                ))}
              </div>
            </Block>
          )}

          {events.length > 0 && (
            <Block title="Próximos eventos">
              <ol className="flex flex-col gap-8">
                {events.map((e) => (
                  <li key={e.id}>
                    <EventAgendaItem event={e} />
                  </li>
                ))}
              </ol>
            </Block>
          )}
        </div>

        <aside className="flex flex-col gap-10 desktop:sticky desktop:top-24 desktop:self-start">
          <Block title="Horarios">
            <WeeklySchedule schedule={r.schedule} specialSchedules={r.specialSchedules} now={now} />
          </Block>

          <Block title="Ubicación y contacto">
            <div className="flex flex-col gap-3">
              <a
                href={links.directions}
                target="_blank"
                rel="noreferrer"
                className={buttonStyles({ variant: 'ghost', fullWidth: true })}
              >
                Abrir en Google Maps
              </a>
              {r.contact.phone && (
                <a
                  href={links.phone}
                  className="flex min-h-11 items-center gap-2 text-body text-ink hover:underline"
                >
                  <Phone aria-hidden size={18} className="text-ink-muted" />
                  {formatPhone(r.contact.phone)}
                  <span className="text-caption text-ink-muted">(demo)</span>
                </a>
              )}
              {links.whatsapp && (
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-11 items-center gap-2 text-body text-ink hover:underline"
                >
                  <MessageCircle aria-hidden size={18} className="text-ink-muted" />
                  Escribir por WhatsApp
                </a>
              )}
            </div>
          </Block>

          {r.social.length > 0 && (
            <Block title="Síguelo">
              <SocialLinks profiles={r.social} />
            </Block>
          )}
        </aside>
      </div>

      <MobileActionBar restaurant={r} />
    </>
  )
}

export function RestaurantPage() {
  const { slug = '' } = useParams()
  const now = useNow()
  const restaurant = useAsync(() => restaurantRepository.getBySlug(slug), [slug])

  return (
    <div className="container-page">
      {restaurant.status === 'loading' && <ProfileSkeleton />}
      {restaurant.status === 'error' && (
        <div className="py-12">
          <ErrorState title="No pudimos cargar este restaurante." onRetry={restaurant.reload} />
        </div>
      )}
      {restaurant.status === 'success' &&
        (restaurant.data ? (
          <RestaurantProfile restaurant={restaurant.data} now={now} />
        ) : (
          <div className="py-12">
            <title>Restaurante no encontrado | Sabor Cubano</title>
            <meta name="robots" content="noindex" />
            <EmptyState
              icon={MapPinOff}
              title="No encontramos este restaurante."
              description="Puede que haya cambiado de nombre o que ya no forme parte de la guía."
              action={
                <Link to="/restaurantes" className={buttonStyles({ variant: 'secondary' })}>
                  Ver todos los restaurantes
                </Link>
              }
            />
          </div>
        ))}
    </div>
  )
}
