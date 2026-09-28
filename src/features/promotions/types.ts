import type { ImageAsset } from '@/shared/lib/images'
import type { Weekday } from '@/features/restaurants'

export interface Promotion {
  id: string
  isDemo: boolean
  restaurantId: string
  title: string
  description: string
  conditions: string[]
  /** Vigencia inclusiva, fechas locales YYYY-MM-DD. */
  startsOn: string
  endsOn: string
  /** Días en que aplica; ausente = todos. */
  weekdays?: Weekday[]
  image: ImageAsset
}
