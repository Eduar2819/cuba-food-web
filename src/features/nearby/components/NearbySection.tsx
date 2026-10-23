import { useMemo } from 'react'
import { Link } from 'react-router'
import { Section, Skeleton, textLinkClass } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { haversineKm } from '@/shared/lib/geo'
import { restaurantRepository, RestaurantRow } from '@/features/restaurants'
import { useUserLocation } from '../hooks/useUserLocation'
import { distanceLabel, FAR_AWAY_KM } from '../services/distance'
import { LocationPrompt } from './LocationPrompt'

/** Cerca de ti: Geolocation API + Haversine + tiempo aproximado. Sin permiso, la página sigue igual. */
export function NearbySection({ now }: { now: Date }) {
  const { location, status } = useUserLocation()
  const data = useAsync(() => restaurantRepository.getAll(), [])

  const nearest = useMemo(() => {
    if (!location || !data.data) return []
    return data.data
      .map((restaurant) => ({ restaurant, km: haversineKm(location, restaurant.address.location) }))
      .sort((a, b) => a.km - b.km)
      .slice(0, 4)
  }, [location, data.data])

  const farAway = (nearest[0]?.km ?? 0) > FAR_AWAY_KM

  return (
    <Section
      title="Cerca de ti"
      description="Los restaurantes más próximos a tu ubicación, con distancia y tiempo aproximado."
      action={
        location ? (
          <Link to="/restaurantes?orden=distancia" className={textLinkClass}>
            Ver todos por distancia
          </Link>
        ) : undefined
      }
    >
      {status !== 'granted' && <LocationPrompt />}
      {status === 'granted' && data.status === 'loading' && (
        <div aria-hidden className="grid gap-3 tablet:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      )}
      {nearest.length > 0 && (
        <div className="flex flex-col gap-4">
          {farAway && (
            <p className="text-small text-ink-muted">
              Parece que estás lejos de Mérida: te mostramos los más cercanos a ti.
            </p>
          )}
          <ul className="grid gap-x-6 gap-y-2 tablet:grid-cols-2">
            {nearest.map(({ restaurant, km }) => (
              <li key={restaurant.id}>
                <RestaurantRow restaurant={restaurant} now={now} distance={distanceLabel(km)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  )
}
