import type { Location } from '@/shared/lib/geo'
import { getOpenStatus } from '@/features/restaurants'
import type { Restaurant } from '@/features/restaurants'
import type { MapMarker } from '../types'

/** Centro de Yucatán (cubre Mérida, Progreso y Valladolid). */
export const YUCATAN_CENTER: Location = { lat: 20.95, lng: -89.05 }

export function toMarkers(restaurants: Restaurant[], now: Date): MapMarker[] {
  return restaurants.map((r) => ({
    id: r.id,
    position: r.address.location,
    label: r.name,
    tone: getOpenStatus(r.schedule, r.specialSchedules, now).state === 'closed' ? 'closed' : 'open',
  }))
}
