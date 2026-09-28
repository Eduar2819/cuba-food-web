import { CUISINES, PRICE_LEVELS, RESTAURANT_TYPES, SERVICES } from '@/data/catalog'
import type { PriceLevel, RestaurantType } from '../types'

/*
 * Catálogos de referencia (tipos, cocinas, servicios, precios). Son datos, no UI:
 * se leen de forma síncrona porque son pequeños y estables; en producción se
 * precargarían una vez desde la API.
 */

export const restaurantTypes = RESTAURANT_TYPES
export const cuisines = CUISINES
export const services = SERVICES
export const priceLevels = PRICE_LEVELS

export function typeLabel(type: RestaurantType): string {
  return RESTAURANT_TYPES.find((t) => t.id === type)?.label ?? type
}

export function cuisineName(id: string): string {
  return CUISINES.find((c) => c.id === id)?.name ?? id
}

export function serviceLabel(id: string): string {
  return SERVICES.find((s) => s.id === id)?.label ?? id
}

export function priceLabel(level: PriceLevel): string {
  return '$'.repeat(level)
}

export function priceDescription(level: PriceLevel): string {
  return PRICE_LEVELS.find((p) => p.value === level)?.description ?? ''
}
