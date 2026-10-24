import { useMemo, useState } from 'react'
import { Clock, LocateFixed, SearchX } from 'lucide-react'
import { Button, Chip, EmptyState, ErrorState, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { applyFilters, useDirectoryFilters } from '@/features/filters'
import { distanceLabel, useUserLocation } from '@/features/nearby'
import { restaurantRepository, RestaurantRow } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { neighborhoods } from '@/features/zones'
import { RestaurantsMap } from '../components/RestaurantsMap'

export function MapPage() {
  const now = useNow()
  const { filters, update } = useDirectoryFilters()
  const location = useUserLocation()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const data = useAsync(() => restaurantRepository.getAll(), [])

  // Cerca de ti: con ubicación, la lista se ordena por distancia.
  const items = useMemo(
    () =>
      applyFilters(
        data.data ?? [],
        { ...filters, orden: location.location ? 'distancia' : filters.orden },
        { now, origin: location.location },
      ),
    [data.data, filters, now, location.location],
  )
  const restaurants = useMemo(() => items.map((i) => i.restaurant), [items])

  return (
    <div className="px-3 pt-4 tablet:px-4 desktop:px-6">
      <Seo
        title="Mapa de restaurantes cubanos en Mérida"
        description="Ubica en el mapa los restaurantes cubanos de Mérida y descubre cuáles están abiertos cerca de ti."
        path="/mapa"
      />
      <div className="mx-auto grid max-w-(--container-page) grid-cols-[minmax(0,1fr)] gap-4 desktop:h-[calc(100dvh-6.5rem)] desktop:grid-cols-[23rem_1fr] desktop:grid-rows-[auto_minmax(0,1fr)]">
        <div className="flex flex-col gap-3 px-1 desktop:col-start-1 desktop:row-start-1">
          <h1 className="text-h1 font-bold text-ink">Mapa</h1>
          <div
            role="radiogroup"
            aria-label="Colonia"
            className="-mx-1 scrollbar-none flex gap-2 overflow-x-auto px-1"
          >
            {[
              { slug: null, name: 'Todas' },
              ...neighborhoods.map((n) => ({ slug: n.slug, name: n.name })),
            ].map((zone) => (
              <Chip
                key={zone.slug ?? 'todas'}
                mode="radio"
                selected={filters.zona === zone.slug}
                onClick={() => {
                  setSelectedId(null)
                  update({ zona: zone.slug })
                }}
              >
                {zone.name}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip
              icon={Clock}
              selected={filters.abierto}
              onClick={() => update({ abierto: !filters.abierto })}
            >
              Abierto ahora
            </Chip>
            {location.status !== 'granted' &&
              location.status !== 'denied' &&
              location.status !== 'unavailable' && (
                <Button
                  variant="subtle"
                  leadingIcon={LocateFixed}
                  loading={location.status === 'locating'}
                  onClick={location.request}
                >
                  Cerca de mí
                </Button>
              )}
          </div>
          {location.status === 'denied' && (
            <p className="text-caption text-ink-muted">
              La ubicación está bloqueada en tu navegador; el mapa funciona igual sin ella.
            </p>
          )}
        </div>

        <RestaurantsMap
          restaurants={restaurants}
          now={now}
          userLocation={location.location}
          selectedId={selectedId}
          onSelect={setSelectedId}
          className="h-[58svh] desktop:col-start-2 desktop:row-span-2 desktop:row-start-1 desktop:h-full"
        />

        <div className="min-h-0 overflow-y-auto pb-6 desktop:col-start-1 desktop:row-start-2">
          <p aria-live="polite" className="px-2 pb-2 text-small font-semibold text-ink">
            {data.status === 'success' &&
              `${items.length} ${items.length === 1 ? 'lugar' : 'lugares'}${location.location ? ', del más cercano al más lejano' : ''}`}
          </p>
          {data.status === 'loading' && (
            <div aria-hidden className="flex flex-col gap-2">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          )}
          {data.status === 'error' && (
            <ErrorState title="No pudimos cargar los restaurantes." onRetry={data.reload} />
          )}
          {data.status === 'success' && items.length === 0 && (
            <EmptyState icon={SearchX} title="No encontramos restaurantes con estos filtros." />
          )}
          <ul className="flex flex-col gap-1">
            {items.map(({ restaurant, distanceKm }) => (
              <li key={restaurant.id}>
                <RestaurantRow
                  restaurant={restaurant}
                  now={now}
                  distance={distanceKm !== undefined ? distanceLabel(distanceKm) : undefined}
                  selected={restaurant.id === selectedId}
                  onSelect={() =>
                    setSelectedId(restaurant.id === selectedId ? null : restaurant.id)
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
