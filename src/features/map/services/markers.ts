import type { Location } from '@/shared/lib/geo'
import { getOpenStatus } from '@/features/restaurants'
import type { Restaurant } from '@/features/restaurants'
import type { MapMarker } from '../types'

/** Centro de Mérida. */
export const MERIDA_CENTER: Location = { lat: 20.9754, lng: -89.6169 }

export function toMarkers(restaurants: Restaurant[], now: Date): MapMarker[] {
  return restaurants.map((r) => ({
    id: r.id,
    position: r.address.location,
    label: r.name,
    tone: getOpenStatus(r.schedule, r.specialSchedules, now).state === 'closed' ? 'closed' : 'open',
  }))
}
