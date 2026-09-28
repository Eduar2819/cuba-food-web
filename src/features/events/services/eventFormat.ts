import { BUSINESS_TIME_ZONE, formatInstantTime, formatLongDate } from '@/shared/lib/dates'
import type { Event, EventCategory } from '../types'

const part = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('es-MX', { timeZone: BUSINESS_TIME_ZONE, ...options })

const dayFmt = part({ day: 'numeric' })
const monthFmt = part({ month: 'short' })
const weekdayFmt = part({ weekday: 'short' })

/** Bloque de fecha para la agenda: { day: "2", month: "oct", weekday: "vie" }. */
export function eventDateBlock(event: Event) {
  const date = new Date(event.startsAt)
  return {
    day: dayFmt.format(date),
    month: monthFmt.format(date).replace('.', ''),
    weekday: weekdayFmt.format(date).replace('.', ''),
  }
}

/** "Viernes 2 de octubre, 8:00 PM a 11:00 PM" */
export function eventWhen(event: Event): string {
  return `${formatLongDate(new Date(event.startsAt))}, ${formatInstantTime(event.startsAt)} a ${formatInstantTime(event.endsAt)}`
}

export function eventPrice(event: Event): string {
  return event.price === 0
    ? 'Entrada libre'
    : new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 0,
      }).format(event.price)
}

export const EVENT_CATEGORY_LABEL: Record<EventCategory, string> = {
  musica: 'Música en vivo',
  degustacion: 'Degustación',
  clase: 'Clase',
  fiesta: 'Fiesta',
}
