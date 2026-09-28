import type { Menu } from '@/features/menu'
import type { ImageAsset } from '@/shared/lib/images'
import type { Location } from '@/shared/lib/geo'

/** 0 = domingo … 6 = sábado (igual que Date#getDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6

/**
 * Rango horario local ("HH:mm", 24 h, zona America/Merida).
 * Si close <= open, el rango cruza la medianoche. "24:00" = fin del día.
 */
export interface TimeRange {
  open: string
  close: string
}

/** Horario semanal: varios rangos por día permiten horarios partidos. Día ausente = cerrado. */
export type Schedule = Partial<Record<Weekday, TimeRange[]>>

/** Excepción por fechas (festivos, cierres temporales, horarios especiales). Fechas locales YYYY-MM-DD, inclusivas. */
export interface SpecialSchedule {
  id: string
  from: string
  to: string
  kind: 'closed' | 'hours'
  /** Solo para kind === 'hours'. */
  ranges?: TimeRange[]
  /** Motivo visible: "Día de la Independencia", "Cierre por remodelación". */
  label: string
}

export type OpenState = 'open' | 'closing-soon' | 'closed'

export interface OpenStatus {
  state: OpenState
  /** Texto principal: "Cierra a las 11:00 PM", "Abre mañana a las 12:00 PM". */
  label: string
  /** Minutos hasta el próximo cambio (abrir o cerrar); null si no hay cambio próximo conocido. */
  minutesUntilChange: number | null
  next: { type: 'opens' | 'closes'; time: string; dayOffset: number } | null
  /** Motivo si hoy aplica un horario especial. */
  specialLabel?: string
}

export type RestaurantType = 'restaurante' | 'cafeteria' | 'bar' | 'comida-para-llevar'

export type PriceLevel = 1 | 2 | 3

export interface Cuisine {
  id: string
  name: string
}

export interface Service {
  id: string
  label: string
}

export interface Address {
  street: string
  neighborhoodId: string
  cityId: string
  postalCode?: string
  reference?: string
  location: Location
}

export type SocialPlatform = 'instagram' | 'facebook' | 'tiktok' | 'x' | 'youtube'

export interface SocialProfile {
  platform: SocialPlatform
  handle: string
  url: string
}

export interface GalleryImage {
  id: string
  image: ImageAsset
  kind: 'platillo' | 'lugar' | 'ambiente'
  caption?: string
}

/**
 * "Todo lo que necesitas saber". Ausente = dato desconocido (no se muestra).
 * false = confirmado que no. Nunca se asume disponibilidad.
 */
export interface RestaurantFacts {
  parking?: boolean
  wifi?: boolean
  cardPayments?: boolean
  reservations?: boolean
  petFriendly?: boolean
  wheelchairAccessible?: boolean
  airConditioning?: boolean
  outdoorSeating?: boolean
  liveMusic?: boolean
  kidsMenu?: boolean
  vegetarianOptions?: boolean
}

export interface RestaurantContact {
  phone?: string
  whatsapp?: string
  email?: string
  website?: string
}

export interface Rating {
  average: number
  count: number
}

export interface Restaurant {
  id: string
  slug: string
  /** Siempre true en el prototipo: los datos son de demostración. */
  isDemo: boolean
  name: string
  tagline: string
  description: string
  type: RestaurantType
  cuisineIds: string[]
  priceLevel: PriceLevel
  address: Address
  schedule: Schedule
  specialSchedules: SpecialSchedule[]
  serviceIds: string[]
  contact: RestaurantContact
  social: SocialProfile[]
  cover: ImageAsset
  gallery: GalleryImage[]
  menu: Menu | null
  /** Platillos del catálogo que ofrece (para "¿Qué se te antoja?"). */
  dishIds: string[]
  facts: RestaurantFacts
  rating?: Rating
  /** 0-100, señal de popularidad para ordenar. */
  popularity: number
  featured: boolean
  /** YYYY-MM-DD */
  createdAt: string
}

export interface Review {
  id: string
  restaurantId: string
  author: string
  rating: number
  text: string
  /** YYYY-MM-DD */
  date: string
  isDemo: boolean
}
