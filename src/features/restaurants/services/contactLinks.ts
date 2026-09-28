import { telHref, whatsappHref } from '@/shared/lib/contact'
import { googleMapsDirectionsUrl } from '@/shared/lib/geo'
import type { Restaurant } from '../types'

/** Enlaces de contacto derivados del restaurante (Google Maps, wa.me, tel:). */
export function contactLinks(r: Restaurant) {
  return {
    directions: googleMapsDirectionsUrl(r.address.location),
    whatsapp: r.contact.whatsapp
      ? whatsappHref(
          r.contact.whatsapp,
          `Hola, vi ${r.name} en Sabor Cubano y quiero más información.`,
        )
      : undefined,
    phone: r.contact.phone ? telHref(r.contact.phone) : undefined,
  }
}
