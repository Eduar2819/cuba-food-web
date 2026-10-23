import type { Event } from '../types'

const toICSDate = (iso: string) =>
  new Date(iso)
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
const escape = (text: string) => text.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

/** Archivo .ics (RFC 5545) para "Agregar a mi calendario". */
export function eventToICS(event: Event, location: string, url: string): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sabor Cubano en Merida//ES',
    'BEGIN:VEVENT',
    `UID:${event.id}@sabor-cubano`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(event.startsAt)}`,
    `DTEND:${toICSDate(event.endsAt)}`,
    `SUMMARY:${escape(event.title)}`,
    `DESCRIPTION:${escape(`${event.description} (Evento de demostración) ${url}`)}`,
    `LOCATION:${escape(location)}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function icsHref(ics: string): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}
