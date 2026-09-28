import { RESTAURANTS } from '@/data/restaurants'
import { REVIEWS } from '@/data/reviews'
import { mockResponse } from '@/shared/lib/mockApi'
import type { Restaurant, Review } from '../types'

/**
 * Contrato de acceso a restaurantes. La UI solo conoce esta interfaz:
 * hoy la implementa un mock en memoria; mañana, un cliente HTTP.
 */
export interface RestaurantRepository {
  getAll(): Promise<Restaurant[]>
  getBySlug(slug: string): Promise<Restaurant | null>
  getByIds(ids: string[]): Promise<Restaurant[]>
  getFeatured(): Promise<Restaurant[]>
  getByCity(cityId: string): Promise<Restaurant[]>
  getByDish(dishId: string): Promise<Restaurant[]>
  getReviews(restaurantId: string): Promise<Review[]>
}

export const restaurantRepository: RestaurantRepository = {
  getAll: () => mockResponse(RESTAURANTS),
  getBySlug: (slug) => mockResponse(RESTAURANTS.find((r) => r.slug === slug) ?? null),
  getByIds: (ids) => mockResponse(RESTAURANTS.filter((r) => ids.includes(r.id))),
  getFeatured: () => mockResponse(RESTAURANTS.filter((r) => r.featured)),
  getByCity: (cityId) => mockResponse(RESTAURANTS.filter((r) => r.address.cityId === cityId)),
  getByDish: (dishId) => mockResponse(RESTAURANTS.filter((r) => r.dishIds.includes(dishId))),
  getReviews: (restaurantId) =>
    mockResponse(REVIEWS.filter((review) => review.restaurantId === restaurantId)),
}
