/**
 * Utilidades de fecha puras. Todo lo "local" se calcula en la zona del negocio
 * (America/Merida), no en la del navegador.
 */

export const BUSINESS_TIME_ZONE = 'America/Merida'

export interface ZonedParts {
  year: number
  month: number
  day: number
  /** 0 = domingo */
  weekday: number
  hour: number
  minute: number
  /** YYYY-MM-DD */
  isoDate: string
  /** Minutos desde las 00:00 locales. */
  minutesOfDay: number
}

const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const formatterCache = new Map<string, Intl.DateTimeFormat>()

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = formatterCache.get(timeZone)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    formatterCache.set(timeZone, formatter)
  }
  return formatter
}

export function getZonedParts(date: Date, timeZone = BUSINESS_TIME_ZONE): ZonedParts {
  const parts = Object.fromEntries(
    partsFormatter(timeZone)
      .formatToParts(date)
      .map((p) => [p.type, p.value]),
  )
  const year = Number(parts.year)
  const month = Number(parts.month)
  const day = Number(parts.day)
  const hour = Number(parts.hour) % 24
  const minute = Number(parts.minute)
  return {
    year,
    month,
    day,
    weekday: WEEKDAYS_EN.indexOf(parts.weekday ?? 'Sun'),
    hour,
    minute,
    isoDate: `${parts.year}-${parts.month}-${parts.day}`,
    minutesOfDay: hour * 60 + minute,
  }
}

/** Suma días a una fecha de calendario YYYY-MM-DD (sin zonas horarias). */
export function addDaysISO(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  const date = new Date(Date.UTC(y, m - 1, d + days))
  return date.toISOString().slice(0, 10)
}

/** Día de la semana (0 = domingo) de una fecha de calendario YYYY-MM-DD. */
export function weekdayOfISO(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/** "HH:mm" → minutos. "24:00" = 1440. */
export function parseTime(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number) as [number, number]
  return h * 60 + m
}

/** Minutos del día → "11:00 PM" (formato del brief). */
export function formatTime12(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440
  const h24 = Math.floor(normalized / 60)
  const m = normalized % 60
  const suffix = h24 < 12 ? 'AM' : 'PM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** "a las 11:00 PM" / "a la 1:00 AM" (concordancia en español). */
export function atTime(minutes: number): string {
  const label = formatTime12(minutes)
  return label.startsWith('1:') ? `a la ${label}` : `a las ${label}`
}

export const WEEKDAY_NAMES = [
  'domingo',
  'lunes',
  'martes',
  'miércoles',
  'jueves',
  'viernes',
  'sábado',
] as const

/** Orden de lectura de la semana en México: lunes primero. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0] as const

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

const dateLong = new Intl.DateTimeFormat('es-MX', {
  timeZone: BUSINESS_TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const dateShort = new Intl.DateTimeFormat('es-MX', {
  timeZone: BUSINESS_TIME_ZONE,
  day: 'numeric',
  month: 'short',
})

const dateWithYear = new Intl.DateTimeFormat('es-MX', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** "Viernes 2 de octubre" */
export function formatLongDate(date: Date): string {
  return capitalize(dateLong.format(date))
}

/** "2 oct" */
export function formatShortDate(date: Date): string {
  return dateShort.format(date).replace('.', '')
}

/** Fecha de calendario YYYY-MM-DD → "18 de septiembre de 2026" */
export function formatISODate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number) as [number, number, number]
  return dateWithYear.format(new Date(Date.UTC(y, m - 1, d)))
}

/** Hora local de Mérida de un instante ISO → "8:00 PM" */
export function formatInstantTime(iso: string): string {
  return formatTime12(getZonedParts(new Date(iso)).minutesOfDay)
}
