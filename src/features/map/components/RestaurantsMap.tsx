import { useMemo, useRef, useState } from 'react'
import { Skeleton } from '@/shared/design-system'
import { useInView } from '@/shared/hooks/useInView'
import { cn } from '@/shared/lib/cn'
import { haversineKm } from '@/shared/lib/geo'
import type { Location } from '@/shared/lib/geo'
import type { Restaurant } from '@/features/restaurants'
import { distanceLabel } from '@/features/nearby'
import { MapView } from './MapView'
import { RestaurantMapCard } from './RestaurantMapCard'
import { toMarkers, YUCATAN_CENTER } from '../services/markers'

interface RestaurantsMapProps {
  restaurants: Restaurant[]
  now: Date
  userLocation?: Location | null
  label?: string
  className?: string
  /** Carga Leaflet solo cuando el mapa se acerca al viewport. */
  lazyMount?: boolean
  selectedId?: string | null
  onSelect?: (id: string | null) => void
}

/** Mapa de restaurantes con marcadores por estado y mini card del seleccionado. */
export function RestaurantsMap({
  restaurants,
  now,
  userLocation,
  label = 'Mapa de restaurantes cubanos',
  className,
  lazyMount = false,
  selectedId: controlledId,
  onSelect,
}: RestaurantsMapProps) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref)
  const [internalId, setInternalId] = useState<string | null>(null)
  const selectedId = controlledId !== undefined ? controlledId : internalId
  const select = (id: string | null) => {
    if (controlledId === undefined) setInternalId(id)
    onSelect?.(id)
  }
  const markers = useMemo(() => toMarkers(restaurants, now), [restaurants, now])
  const selected = restaurants.find((r) => r.id === selectedId)

  return (
    <div ref={ref} className={cn('relative isolate overflow-hidden rounded-lg', className)}>
      {!lazyMount || visible ? (
        <MapView
          markers={markers}
          center={YUCATAN_CENTER}
          zoom={9}
          selectedId={selectedId}
          onSelect={select}
          userLocation={userLocation}
          label={label}
          className="absolute inset-0"
        />
      ) : (
        <Skeleton className="absolute inset-0 rounded-none" />
      )}
      {selected && (
        <div className="absolute inset-x-3 bottom-3 z-(--z-raised) tablet:right-auto tablet:w-[24rem]">
          <RestaurantMapCard
            restaurant={selected}
            now={now}
            distance={
              userLocation
                ? distanceLabel(haversineKm(userLocation, selected.address.location))
                : undefined
            }
            onClose={() => select(null)}
          />
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {selected ? `Seleccionado: ${selected.name}` : ''}
      </p>
    </div>
  )
}
