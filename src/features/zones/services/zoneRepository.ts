import { CITIES, NEIGHBORHOODS } from '@/data/zones'
import { RESTAURANTS } from '@/data/restaurants'
import { mockResponse } from '@/shared/lib/mockApi'
import type { City, Neighborhood, ZoneSummary } from '../types'

export interface ZoneRepository {
  getCities(): Promise<City[]>
  getCityBySlug(slug: string): Promise<City | null>
  getNeighborhoods(cityId?: string): Promise<Neighborhood[]>
  /** Ciudades con el conteo de restaurantes (la API lo daría agregado). */
  getZoneSummaries(): Promise<ZoneSummary[]>
}

export const zoneRepository: ZoneRepository = {
  getCities: () => mockResponse(CITIES),
  getCityBySlug: (slug) => mockResponse(CITIES.find((c) => c.slug === slug) ?? null),
  getNeighborhoods: (cityId) =>
    mockResponse(cityId ? NEIGHBORHOODS.filter((n) => n.cityId === cityId) : NEIGHBORHOODS),
  getZoneSummaries: () =>
    mockResponse(
      CITIES.map((city) => ({
        ...city,
        restaurantCount: RESTAURANTS.filter((r) => r.address.cityId === city.id).length,
      })),
    ),
}

/** Búsquedas síncronas de nombres (catálogo pequeño y estable). */
export function cityName(cityId: string): string {
  return CITIES.find((c) => c.id === cityId)?.name ?? cityId
}

export function neighborhoodName(neighborhoodId: string): string {
  return NEIGHBORHOODS.find((n) => n.id === neighborhoodId)?.name ?? neighborhoodId
}

export const cities = CITIES
export const neighborhoods = NEIGHBORHOODS
