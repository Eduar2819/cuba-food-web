import {
  addDaysISO,
  atTime,
  BUSINESS_TIME_ZONE,
  getZonedParts,
  parseTime,
  weekdayOfISO,
  WEEKDAY_NAMES,
} from '@/shared/lib/dates'
import type { OpenStatus, Schedule, SpecialSchedule, TimeRange, Weekday } from '../types'

export const CLOSING_SOON_MINUTES = 60
/** Días hacia adelante que se buscan para la próxima apertura (cubre cierres temporales). */
const HORIZON_DAYS = 21
const DAY = 1440

interface Interval {
  start: number
  end: number
}

/** Excepción que aplica a una fecha local YYYY-MM-DD (la última definida gana). */
export function findSpecialSchedule(
  specialSchedules: SpecialSchedule[],
  isoDate: string,
): SpecialSchedule | undefined {
  let match: SpecialSchedule | undefined
  for (const special of specialSchedules) {
    if (special.from <= isoDate && isoDate <= special.to) match = special
  }
  return match
}

/** Rangos efectivos de una fecha: excepción si existe, si no el horario semanal. */
export function getRangesForDate(
  schedule: Schedule,
  specialSchedules: SpecialSchedule[],
  isoDate: string,
): TimeRange[] {
  const special = findSpecialSchedule(specialSchedules, isoDate)
  if (special) return special.kind === 'closed' ? [] : (special.ranges ?? [])
  return schedule[weekdayOfISO(isoDate) as Weekday] ?? []
}

/** Intervalos en minutos relativos a las 00:00 del día de referencia, ordenados y fusionados. */
function buildIntervals(
  schedule: Schedule,
  specialSchedules: SpecialSchedule[],
  todayISO: string,
): Interval[] {
  const raw: Interval[] = []
  for (let offset = -1; offset <= HORIZON_DAYS; offset++) {
    const isoDate = addDaysISO(todayISO, offset)
    const base = offset * DAY
    for (const range of getRangesForDate(schedule, specialSchedules, isoDate)) {
      const open = parseTime(range.open)
      let close = parseTime(range.close)
      if (close <= open) close += DAY // cruza la medianoche
      raw.push({ start: base + open, end: base + close })
    }
  }
  raw.sort((a, b) => a.start - b.start)
  const merged: Interval[] = []
  for (const interval of raw) {
    const last = merged[merged.length - 1]
    if (last && interval.start <= last.end) last.end = Math.max(last.end, interval.end)
    else merged.push({ ...interval })
  }
  return merged
}

const dayMonth = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})

function dayPhrase(todayISO: string, dayOffset: number): string {
  if (dayOffset === 0) return 'hoy'
  if (dayOffset === 1) return 'mañana'
  const iso = addDaysISO(todayISO, dayOffset)
  const weekday = WEEKDAY_NAMES[weekdayOfISO(iso)]
  if (dayOffset < 7) return `el ${weekday}`
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  return `el ${weekday} ${dayMonth.format(new Date(Date.UTC(y, m - 1, d)))}`
}

const toHHmm = (minutes: number) => {
  const m = ((minutes % DAY) + DAY) % DAY
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

/**
 * Estado abierto/cerrado de un restaurante en un instante dado.
 * Soporta horarios partidos, cruces de medianoche, festivos y cierres temporales.
 * Función pura: `now` se inyecta.
 */
export function getOpenStatus(
  schedule: Schedule,
  specialSchedules: SpecialSchedule[],
  now: Date,
  timeZone: string = BUSINESS_TIME_ZONE,
): OpenStatus {
  const local = getZonedParts(now, timeZone)
  const nowMin = local.minutesOfDay
  const intervals = buildIntervals(schedule, specialSchedules, local.isoDate)
  const specialToday = findSpecialSchedule(specialSchedules, local.isoDate)
  const specialLabel = specialToday?.label

  const current = intervals.find((i) => i.start <= nowMin && nowMin < i.end)
  if (current) {
    const remaining = current.end - nowMin
    if (remaining >= HORIZON_DAYS * DAY - DAY) {
      return {
        state: 'open',
        label: 'Abierto las 24 horas',
        minutesUntilChange: null,
        next: null,
        specialLabel,
      }
    }
    return {
      state: remaining < CLOSING_SOON_MINUTES ? 'closing-soon' : 'open',
      label: `Cierra ${atTime(current.end)}`,
      minutesUntilChange: remaining,
      next: { type: 'closes', time: toHHmm(current.end), dayOffset: Math.floor(current.end / DAY) },
      specialLabel,
    }
  }

  const upcoming = intervals.find((i) => i.start > nowMin)
  if (!upcoming) {
    return {
      state: 'closed',
      label: specialLabel ?? 'Sin horario disponible',
      minutesUntilChange: null,
      next: null,
      specialLabel,
    }
  }
  const dayOffset = Math.floor(upcoming.start / DAY)
  return {
    state: 'closed',
    label: `Abre ${dayPhrase(local.isoDate, dayOffset)} ${atTime(upcoming.start)}`,
    minutesUntilChange: upcoming.start - nowMin,
    next: { type: 'opens', time: toHHmm(upcoming.start), dayOffset },
    specialLabel,
  }
}
