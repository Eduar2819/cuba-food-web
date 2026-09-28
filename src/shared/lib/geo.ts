/** Coordenadas geográficas (WGS84). */
export interface Location {
  lat: number
  lng: number
}

const EARTH_RADIUS_KM = 6371

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Distancia en km entre dos puntos (fórmula de Haversine). */
export function haversineKm(a: Location, b: Location): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export type TravelMode = 'walk' | 'drive'

/** Velocidades medias urbanas aproximadas (km/h). Factor 1.3 por trazado de calles. */
const SPEED_KMH: Record<TravelMode, number> = { walk: 4.5, drive: 28 }
const ROUTE_FACTOR = 1.3

/** Minutos aproximados de trayecto. Nunca menos de 1. */
export function estimateMinutes(km: number, mode: TravelMode): number {
  return Math.max(1, Math.round(((km * ROUTE_FACTOR) / SPEED_KMH[mode]) * 60))
}

/** Modo sugerido: a pie hasta 1.5 km, en auto después. */
export function suggestedMode(km: number): TravelMode {
  return km <= 1.5 ? 'walk' : 'drive'
}

const kmFormatter = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 1 })

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round((km * 1000) / 10) * 10} m`
  return `${kmFormatter.format(km)} km`
}

export function googleMapsDirectionsUrl(to: Location): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}`
}
