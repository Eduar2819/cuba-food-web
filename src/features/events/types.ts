import type { ImageAsset } from '@/shared/lib/images'

export type EventCategory = 'musica' | 'degustacion' | 'clase' | 'fiesta'

export interface Event {
  id: string
  slug: string
  isDemo: boolean
  restaurantId: string
  title: string
  summary: string
  description: string
  category: EventCategory
  /** ISO 8601 con offset de Mérida (-06:00). */
  startsAt: string
  endsAt: string
  image: ImageAsset
  /** MXN; 0 = entrada libre. */
  price: number
  ctaLabel: string
}
