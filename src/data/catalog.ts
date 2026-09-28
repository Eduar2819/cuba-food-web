import type { Cuisine, RestaurantType, Service } from '@/features/restaurants'
import type { DishCategory } from '@/features/dishes'

export const CUISINES: Cuisine[] = [
  { id: 'cubana', name: 'Cubana tradicional' },
  { id: 'cubano-yucateca', name: 'Fusión cubano-yucateca' },
  { id: 'mariscos-caribe', name: 'Mariscos del Caribe' },
  { id: 'cafe-reposteria', name: 'Café y repostería cubana' },
  { id: 'sandwiches', name: 'Sándwiches y antojitos' },
]

export const RESTAURANT_TYPES: { id: RestaurantType; label: string; plural: string }[] = [
  { id: 'restaurante', label: 'Restaurante', plural: 'Restaurantes' },
  { id: 'cafeteria', label: 'Cafetería', plural: 'Cafeterías' },
  { id: 'bar', label: 'Bar', plural: 'Bares' },
  { id: 'comida-para-llevar', label: 'Comida para llevar', plural: 'Comida para llevar' },
]

export const SERVICES: Service[] = [
  { id: 'comer-aqui', label: 'Comer aquí' },
  { id: 'para-llevar', label: 'Para llevar' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'reservaciones', label: 'Reservaciones' },
  { id: 'eventos-privados', label: 'Eventos privados' },
]

export const DISH_CATEGORIES: DishCategory[] = [
  { id: 'platos-fuertes', slug: 'platos-fuertes', name: 'Platos fuertes' },
  { id: 'sandwiches', slug: 'sandwiches', name: 'Sándwiches' },
  { id: 'antojitos', slug: 'antojitos', name: 'Antojitos y entradas' },
  { id: 'acompanamientos', slug: 'acompanamientos', name: 'Acompañamientos' },
  { id: 'mariscos', slug: 'mariscos', name: 'Mariscos' },
  { id: 'postres', slug: 'postres', name: 'Postres' },
  { id: 'bebidas', slug: 'bebidas', name: 'Café y bebidas' },
]

export const PRICE_LEVELS = [
  { value: 1, label: '$', description: 'Hasta $200 por persona' },
  { value: 2, label: '$$', description: '$200 a $450 por persona' },
  { value: 3, label: '$$$', description: 'Más de $450 por persona' },
] as const
