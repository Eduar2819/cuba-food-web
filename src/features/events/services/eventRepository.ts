import { EVENTS } from '@/data/events'
import { mockResponse } from '@/shared/lib/mockApi'
import type { Event } from '../types'

/** Un evento sigue visible hasta que termina. */
export function isUpcomingEvent(event: Event, now: Date): boolean {
  return new Date(event.endsAt).getTime() > now.getTime()
}

export function sortByStart(events: Event[]): Event[] {
  return [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt))
}

export function upcomingEvents(events: Event[], now: Date): Event[] {
  return sortByStart(events.filter((e) => isUpcomingEvent(e, now)))
}

export interface EventRepository {
  getUpcoming(now: Date): Promise<Event[]>
  getBySlug(slug: string): Promise<Event | null>
  getByRestaurant(restaurantId: string, now: Date): Promise<Event[]>
}

export const eventRepository: EventRepository = {
  getUpcoming: (now) => mockResponse(upcomingEvents(EVENTS, now)),
  getBySlug: (slug) => mockResponse(EVENTS.find((e) => e.slug === slug) ?? null),
  getByRestaurant: (restaurantId, now) =>
    mockResponse(
      upcomingEvents(
        EVENTS.filter((e) => e.restaurantId === restaurantId),
        now,
      ),
    ),
}
