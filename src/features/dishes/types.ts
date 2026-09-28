import type { ImageAsset } from '@/shared/lib/images'

export interface DishCategory {
  id: string
  slug: string
  name: string
}

/** Platillo del catálogo cultural (/platillos/:slug). */
export interface Dish {
  id: string
  slug: string
  name: string
  categoryId: string
  /** Una línea: qué es. */
  summary: string
  /** Guía cultural: origen y cómo se come. */
  story: string
  image: ImageAsset
  /** Sinónimos para la búsqueda ("medianoche", "moros y cristianos"...). */
  keywords: string[]
  popular: boolean
}
