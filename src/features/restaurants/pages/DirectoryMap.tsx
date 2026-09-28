import { RestaurantsMap } from '@/features/map'
import type { DirectoryItem } from '@/features/filters'
import { useUserLocation } from '@/features/nearby'

/** Vista de mapa del directorio: mismos resultados filtrados, en el mapa. */
export function DirectoryMap({ items, now }: { items: DirectoryItem[]; now: Date }) {
  const { location } = useUserLocation()
  return (
    <RestaurantsMap
      restaurants={items.map((i) => i.restaurant)}
      now={now}
      userLocation={location}
      label="Resultados del directorio en el mapa"
      className="h-[70svh] min-h-[26rem] animate-[rise-in_var(--dur-normal)_var(--ease-out-soft)]"
    />
  )
}
