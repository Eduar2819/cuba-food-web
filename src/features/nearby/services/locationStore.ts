import type { Location } from '@/shared/lib/geo'

export type LocationStatus =
  | 'idle' // aún no se pidió
  | 'locating'
  | 'granted'
  | 'denied' // el usuario negó el permiso
  | 'unavailable' // sin Geolocation API o sin señal
  | 'timeout'

export interface LocationState {
  status: LocationStatus
  location: Location | null
}

/**
 * Ubicación del usuario compartida entre páginas (un solo permiso por visita).
 * Nunca pide permiso sin una acción explícita; si el permiso ya estaba concedido,
 * obtiene la ubicación en silencio.
 */
function createLocationStore() {
  let state: LocationState = { status: 'idle', location: null }
  const listeners = new Set<() => void>()
  const set = (next: LocationState) => {
    state = next
    listeners.forEach((l) => l())
  }

  const request = () => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      set({ status: 'unavailable', location: null })
      return
    }
    if (state.status === 'locating') return
    set({ status: 'locating', location: state.location })
    navigator.geolocation.getCurrentPosition(
      (position) =>
        set({
          status: 'granted',
          location: { lat: position.coords.latitude, lng: position.coords.longitude },
        }),
      (error) =>
        set({
          status:
            error.code === error.PERMISSION_DENIED
              ? 'denied'
              : error.code === error.TIMEOUT
                ? 'timeout'
                : 'unavailable',
          location: null,
        }),
      { enableHighAccuracy: false, timeout: 10_000, maximumAge: 5 * 60_000 },
    )
  }

  // Si el permiso ya está concedido, se usa sin mostrar diálogo.
  if (typeof navigator !== 'undefined' && navigator.permissions?.query) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permission) => {
        if (permission.state === 'granted') request()
        if (permission.state === 'denied') set({ status: 'denied', location: null })
      })
      .catch(() => {})
  }

  return {
    getSnapshot: () => state,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    request,
  }
}

export const locationStore = createLocationStore()
