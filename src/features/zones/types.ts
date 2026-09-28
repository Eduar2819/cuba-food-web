import type { ImageAsset } from '@/shared/lib/images'
import type { Location } from '@/shared/lib/geo'

/** Ciudad = zona navegable (/zonas/:slug). */
export interface City {
  id: string
  slug: string
  name: string
  state: string
  description: string
  center: Location
  /** Zoom sugerido para el mapa. */
  zoom: number
  image: ImageAsset
}

export interface Neighborhood {
  id: string
  slug: string
  name: string
  cityId: string
}

export interface ZoneSummary extends City {
  restaurantCount: number
}
