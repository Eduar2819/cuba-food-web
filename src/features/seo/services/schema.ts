import type { BlogPost } from '@/features/blog'
import type { Event } from '@/features/events'
import type { Restaurant, Weekday } from '@/features/restaurants'
import { imageUrl } from '@/shared/lib/images'
import { absoluteUrl, SITE } from '@/shared/lib/site'

const DAY_NAMES: Record<Weekday, string> = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
}

/**
 * Schema.org Restaurant. Nota: al ser datos demo NO se publica aggregateRating
 * (Google penaliza calificaciones que no provienen de reseñas reales).
 */
export function restaurantJsonLd(r: Restaurant, cityName: string, neighborhoodName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: r.name,
    description: r.description,
    url: absoluteUrl(`/restaurantes/${r.slug}`),
    image: [r.cover, ...r.gallery.map((g) => g.image)]
      .slice(0, 4)
      .map((img) => imageUrl(img, { width: 1200, ratio: '4/3' })),
    ...(r.contact.phone ? { telephone: r.contact.phone } : {}),
    priceRange: '$'.repeat(r.priceLevel),
    servesCuisine: ['Cubana'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: r.address.street,
      addressLocality: `${neighborhoodName}, ${cityName}`,
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: r.address.location.lat,
      longitude: r.address.location.lng,
    },
    openingHoursSpecification: (
      Object.entries(r.schedule) as [string, { open: string; close: string }[]][]
    ).flatMap(([day, ranges]) =>
      ranges.map((range) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: DAY_NAMES[Number(day) as Weekday],
        opens: range.open,
        closes: range.close === '24:00' ? '23:59' : range.close,
      })),
    ),
    ...(r.menu?.type === 'url' || r.menu?.type === 'pdf'
      ? { hasMenu: r.menu.url.startsWith('http') ? r.menu.url : absoluteUrl(r.menu.url) }
      : {}),
    acceptsReservations: r.facts.reservations ?? undefined,
    sameAs: r.social.map((s) => s.url),
  }
}

export function eventJsonLd(event: Event, restaurant: Restaurant | undefined, cityName: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.startsAt,
    endDate: event.endsAt,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image: [imageUrl(event.image, { width: 1200, ratio: '16/9' })],
    url: absoluteUrl(`/eventos/${event.slug}`),
    location: restaurant && {
      '@type': 'Place',
      name: restaurant.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: restaurant.address.street,
        addressLocality: cityName,
        addressRegion: 'Yucatán',
        addressCountry: 'MX',
      },
    },
    offers: {
      '@type': 'Offer',
      price: event.price,
      priceCurrency: 'MXN',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/eventos/${event.slug}`),
    },
    organizer: restaurant && {
      '@type': 'Organization',
      name: restaurant.name,
      url: absoluteUrl(`/restaurantes/${restaurant.slug}`),
    },
  }
}

export function articleJsonLd(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [imageUrl(post.cover, { width: 1200, ratio: '16/9' })],
    datePublished: post.publishedAt,
    author: { '@type': 'Organization', name: post.author },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: 'es-MX',
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}
