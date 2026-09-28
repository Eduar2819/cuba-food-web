import { getOpenStatus } from '@/features/restaurants'
import type { Restaurant } from '@/features/restaurants'
import { cities } from '@/features/zones'
import { haversineKm } from '@/shared/lib/geo'
import type { Location } from '@/shared/lib/geo'
import type { DirectoryFilters } from './filterParams'

export interface FilterContext {
  now: Date
  /** Puntuación de búsqueda por restaurante (solo si hay ?q=). Ausente del mapa = no coincide. */
  searchScores?: Map<string, number> | null
  /** Ubicación del usuario para distancia. */
  origin?: Location | null
}

export interface DirectoryItem {
  restaurant: Restaurant
  distanceKm?: number
}

const cityIdBySlug = new Map(cities.map((c) => [c.slug, c.id]))

/** Filtra sin ordenar. Función pura: la usan el directorio y los conteos por faceta. */
export function matchesFilters(r: Restaurant, f: DirectoryFilters, ctx: FilterContext): boolean {
  if (f.q && ctx.searchScores && !ctx.searchScores.has(r.id)) return false
  if (f.zona && r.address.cityId !== cityIdBySlug.get(f.zona)) return false
  if (f.tipos.length && !f.tipos.includes(r.type)) return false
  if (f.servicios.length && !f.servicios.every((s) => r.serviceIds.includes(s))) return false
  if (f.precios.length && !f.precios.includes(r.priceLevel)) return false
  if (f.abierto && getOpenStatus(r.schedule, r.specialSchedules, ctx.now).state === 'closed')
    return false
  return true
}

export function applyFilters(
  restaurants: Restaurant[],
  filters: DirectoryFilters,
  ctx: FilterContext,
): DirectoryItem[] {
  const items: DirectoryItem[] = restaurants
    .filter((r) => matchesFilters(r, filters, ctx))
    .map((restaurant) => ({
      restaurant,
      distanceKm: ctx.origin ? haversineKm(ctx.origin, restaurant.address.location) : undefined,
    }))

  const relevance = (a: DirectoryItem, b: DirectoryItem) => {
    if (filters.q && ctx.searchScores) {
      const diff =
        (ctx.searchScores.get(b.restaurant.id) ?? 0) - (ctx.searchScores.get(a.restaurant.id) ?? 0)
      if (diff !== 0) return diff
    }
    return (
      Number(b.restaurant.featured) - Number(a.restaurant.featured) ||
      b.restaurant.popularity - a.restaurant.popularity
    )
  }

  const comparators: Record<
    DirectoryFilters['orden'],
    (a: DirectoryItem, b: DirectoryItem) => number
  > = {
    relevancia: relevance,
    distancia: (a, b) =>
      a.distanceKm !== undefined && b.distanceKm !== undefined
        ? a.distanceKm - b.distanceKm
        : relevance(a, b),
    rating: (a, b) =>
      (b.restaurant.rating?.average ?? -1) - (a.restaurant.rating?.average ?? -1) ||
      (b.restaurant.rating?.count ?? 0) - (a.restaurant.rating?.count ?? 0),
    populares: (a, b) => b.restaurant.popularity - a.restaurant.popularity,
  }

  return items.sort(comparators[filters.orden])
}

/** Cuántos resultados habría con cada valor de una faceta, manteniendo el resto de filtros. */
export function facetCounts<K extends 'zona' | 'tipos' | 'servicios' | 'precios'>(
  restaurants: Restaurant[],
  filters: DirectoryFilters,
  ctx: FilterContext,
  facet: K,
  values: DirectoryFilters[K] extends (infer V)[] ? V[] : string[],
): Map<string, number> {
  const counts = new Map<string, number>()
  for (const value of values) {
    const scoped: DirectoryFilters = {
      ...filters,
      [facet]: facet === 'zona' ? value : [value],
    }
    counts.set(String(value), restaurants.filter((r) => matchesFilters(r, scoped, ctx)).length)
  }
  return counts
}
