import { DISH_CATEGORIES } from '@/data/catalog'
import { DISHES } from '@/data/dishes'
import { mockResponse } from '@/shared/lib/mockApi'
import type { Dish, DishCategory } from '../types'

export interface DishRepository {
  getAll(): Promise<Dish[]>
  getBySlug(slug: string): Promise<Dish | null>
  getCategories(): Promise<DishCategory[]>
}

export const dishRepository: DishRepository = {
  getAll: () => mockResponse(DISHES),
  getBySlug: (slug) => mockResponse(DISHES.find((d) => d.slug === slug) ?? null),
  getCategories: () => mockResponse(DISH_CATEGORIES),
}

export const dishes = DISHES
export const dishCategories = DISH_CATEGORIES

export function dishById(id: string): Dish | undefined {
  return DISHES.find((d) => d.id === id)
}
