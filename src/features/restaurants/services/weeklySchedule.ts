import {
  addDaysISO,
  BUSINESS_TIME_ZONE,
  capitalize,
  formatTime12,
  getZonedParts,
  parseTime,
  WEEK_ORDER,
  WEEKDAY_NAMES,
} from '@/shared/lib/dates'
import type { Schedule, SpecialSchedule, TimeRange, Weekday } from '../types'
import { findSpecialSchedule, getRangesForDate } from './openStatus'

export interface ScheduleRow {
  weekday: Weekday
  dayName: string
  /** Fecha local YYYY-MM-DD de esta semana (hoy + n). */
  isoDate: string
  isToday: boolean
  ranges: TimeRange[]
  /** "1:00 PM – 11:00 PM" o "Cerrado" */
  text: string
  special?: SpecialSchedule
}

export function formatRanges(ranges: TimeRange[]): string {
  if (ranges.length === 0) return 'Cerrado'
  return ranges
    .map((r) => {
      if (r.open === '00:00' && r.close === '24:00') return 'Abierto 24 horas'
      return `${formatTime12(parseTime(r.open))} a ${formatTime12(parseTime(r.close))}`
    })
    .join(' y ')
}

/**
 * Semana a mostrar en el perfil, de lunes a domingo, con las excepciones
 * que caen en los próximos 7 días aplicadas y el día actual marcado.
 */
export function getWeeklySchedule(
  schedule: Schedule,
  specialSchedules: SpecialSchedule[],
  now: Date,
  timeZone: string = BUSINESS_TIME_ZONE,
): ScheduleRow[] {
  const today = getZonedParts(now, timeZone)
  return WEEK_ORDER.map((weekday) => {
    const offset = (weekday - today.weekday + 7) % 7
    const isoDate = addDaysISO(today.isoDate, offset)
    const ranges = getRangesForDate(schedule, specialSchedules, isoDate)
    return {
      weekday,
      dayName: capitalize(WEEKDAY_NAMES[weekday]),
      isoDate,
      isToday: offset === 0,
      ranges,
      text: formatRanges(ranges),
      special: findSpecialSchedule(specialSchedules, isoDate),
    }
  })
}
