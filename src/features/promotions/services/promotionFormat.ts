import { formatISODate, WEEKDAY_NAMES } from '@/shared/lib/dates'
import type { Promotion } from '../types'
import type { PromotionStatus } from './promotionRepository'

/** "Válida hasta el 31 de octubre de 2026" / "Desde el 1 de octubre de 2026" */
export function promotionValidity(promotion: Promotion, status: PromotionStatus): string {
  return status === 'upcoming'
    ? `Desde el ${formatISODate(promotion.startsOn)}`
    : `Válida hasta el ${formatISODate(promotion.endsOn)}`
}

/** "Solo jueves" / "Martes, miércoles, jueves y viernes" */
export function promotionDays(promotion: Promotion): string | null {
  if (!promotion.weekdays?.length) return null
  const names = promotion.weekdays.map((d) => WEEKDAY_NAMES[d])
  if (names.length === 1) return `Solo ${names[0]}`
  const text = `${names.slice(0, -1).join(', ')} y ${names[names.length - 1]}`
  return text.charAt(0).toUpperCase() + text.slice(1)
}
