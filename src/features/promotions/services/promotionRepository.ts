import { PROMOTIONS } from '@/data/promotions'
import { BUSINESS_TIME_ZONE, getZonedParts } from '@/shared/lib/dates'
import { mockResponse } from '@/shared/lib/mockApi'
import type { Promotion } from '../types'

export type PromotionStatus = 'active' | 'upcoming' | 'expired'

/** Estado de vigencia comparando fechas locales YYYY-MM-DD (inclusivas). */
export function getPromotionStatus(promotion: Promotion, todayISO: string): PromotionStatus {
  if (todayISO > promotion.endsOn) return 'expired'
  if (todayISO < promotion.startsOn) return 'upcoming'
  return 'active'
}

/** ¿Aplica hoy? Vigente y, si define días, hoy es uno de ellos. */
export function appliesOn(promotion: Promotion, todayISO: string, weekday: number): boolean {
  if (getPromotionStatus(promotion, todayISO) !== 'active') return false
  return !promotion.weekdays || promotion.weekdays.some((d) => d === weekday)
}

/** Visibles = no vencidas. Primero las activas, luego las próximas; por fecha de fin. */
export function visiblePromotions(promotions: Promotion[], now: Date): Promotion[] {
  const today = getZonedParts(now, BUSINESS_TIME_ZONE).isoDate
  const rank = { active: 0, upcoming: 1, expired: 2 } as const
  return promotions
    .filter((p) => getPromotionStatus(p, today) !== 'expired')
    .sort(
      (a, b) =>
        rank[getPromotionStatus(a, today)] - rank[getPromotionStatus(b, today)] ||
        a.endsOn.localeCompare(b.endsOn),
    )
}

export interface PromotionRepository {
  getVisible(now: Date): Promise<Promotion[]>
  getByRestaurant(restaurantId: string, now: Date): Promise<Promotion[]>
}

export const promotionRepository: PromotionRepository = {
  getVisible: (now) => mockResponse(visiblePromotions(PROMOTIONS, now)),
  getByRestaurant: (restaurantId, now) =>
    mockResponse(
      visiblePromotions(
        PROMOTIONS.filter((p) => p.restaurantId === restaurantId),
        now,
      ),
    ),
}
