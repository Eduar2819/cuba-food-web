import { Link, useParams } from 'react-router'
import { MapPinOff } from 'lucide-react'
import {
  Breadcrumbs,
  buttonStyles,
  chipStyles,
  EmptyState,
  ErrorState,
  Skeleton,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl } from '@/features/filters'
import { RestaurantsMap } from '@/features/map'
import { restaurantRepository, RestaurantCard } from '@/features/restaurants'
import { breadcrumbJsonLd, Seo } from '@/features/seo'
import { zoneRepository } from '../services/zoneRepository'

export function ZonePage() {
  const { slug = '' } = useParams()
  const now = useNow()
  const data = useAsync(async () => {
    const city = await zoneRepository.getCityBySlug(slug)
    if (!city) return { city: null, restaurants: [], neighborhoods: [] }
    const [restaurants, neighborhoods] = await Promise.all([
      restaurantRepository.getByCity(city.id),
      zoneRepository.getNeighborhoods(city.id),
    ])
    return { city, restaurants, neighborhoods }
  }, [slug])

  if (data.status === 'loading')
    return (
      <div aria-hidden className="px-3 pt-3 tablet:px-4 desktop:px-6">
        <Skeleton className="h-[22rem] rounded-xl" />
      </div>
    )
  if (data.status === 'error')
    return (
      <div className="container-page py-12">
        <ErrorState title="No pudimos cargar esta zona." onRetry={data.reload} />
      </div>
    )

  const { city, restaurants, neighborhoods } = data.data
  if (!city)
    return (
      <div className="container-page py-12">
        <title>Zona no encontrada | Sabor Cubano</title>
        <EmptyState
          icon={MapPinOff}
          title="No encontramos esta zona."
          action={
            <Link to="/zonas" className={buttonStyles({ variant: 'secondary' })}>
              Ver todas las zonas
            </Link>
          }
        />
      </div>
    )

  const image = responsiveImage(city.image, { ratio: '21/9', sizes: '100vw' })
  const path = `/zonas/${city.slug}`
  const sorted = [...restaurants].sort((a, b) => b.popularity - a.popularity)

  return (
    <>
      <Seo
        title={`Restaurantes cubanos en ${city.name}`}
        description={`${city.description} ${restaurants.length} restaurantes cubanos en ${city.name}, ${city.state}.`}
        path={path}
        image={city.image}
        jsonLd={breadcrumbJsonLd([
          { name: 'Zonas', path: '/zonas' },
          { name: city.name, path },
        ])}
      />
      <section aria-labelledby="zona-titulo" className="px-3 pt-3 tablet:px-4 desktop:px-6">
        <div className="relative isolate mx-auto flex min-h-[20rem] max-w-(--container-page) overflow-hidden rounded-xl bg-anil-975 tablet:min-h-[26rem]">
          <img
            {...image}
            alt=""
            fetchPriority="high"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-linear-to-t from-anil-975/90 via-anil-975/40 to-transparent"
          />
          <div className="mt-auto flex max-w-2xl flex-col gap-3 p-6 tablet:p-10">
            <h1 id="zona-titulo" className="text-display font-bold text-arena-50">
              {city.name}
            </h1>
            <p className="text-lead text-arena-100">{city.description}</p>
          </div>
        </div>
      </section>

      <div className="container-page flex flex-col gap-10 pt-6 pb-10">
        <Breadcrumbs
          items={[
            {
              label: 'Zonas',
              link: (
                <Link to="/zonas" className="hover:text-ink hover:underline">
                  Zonas
                </Link>
              ),
            },
            { label: city.name },
          ]}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-h3 font-semibold text-ink">
            {sorted.length === 1 ? '1 restaurante' : `${sorted.length} restaurantes`} en {city.name}
          </p>
          <Link
            to={directoryUrl({ zona: city.slug })}
            className={buttonStyles({ variant: 'secondary' })}
          >
            Filtrar en el directorio
          </Link>
        </div>
        {neighborhoods.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Colonias">
            {neighborhoods.map((n) => (
              <li key={n.id}>
                <Link to={directoryUrl({ q: n.name, zona: city.slug })} className={chipStyles()}>
                  {n.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <ul className="grid gap-x-6 gap-y-12 tablet:grid-cols-2 desktop:grid-cols-3">
          {sorted.map((restaurant) => (
            <li key={restaurant.id}>
              <RestaurantCard restaurant={restaurant} now={now} headingLevel="h2" />
            </li>
          ))}
        </ul>
        {sorted.length > 0 && (
          <RestaurantsMap
            restaurants={sorted}
            now={now}
            lazyMount
            label={`Mapa de restaurantes cubanos en ${city.name}`}
            className="h-[26rem]"
          />
        )}
      </div>
    </>
  )
}
