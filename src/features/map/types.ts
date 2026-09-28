import type { ComponentType } from 'react'
import type { Location } from '@/shared/lib/geo'

export interface MapMarker {
  id: string
  position: Location
  /** Texto accesible del marcador (nombre del lugar). */
  label: string
  /** Variante visual: estado abierto/cerrado sin depender solo del color (el pin cambia de forma). */
  tone?: 'open' | 'closed' | 'default'
}

export interface MapViewProps {
  markers: MapMarker[]
  center: Location
  zoom: number
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  /** Ajusta la vista a todos los marcadores cuando cambian. */
  fitToMarkers?: boolean
  /** Posición del usuario (Cerca de ti). */
  userLocation?: Location | null
  /** Etiqueta accesible del mapa. */
  label: string
  interactive?: boolean
  className?: string
}

/**
 * Contrato del proveedor de mapas. La UI solo usa <MapView />; la implementación
 * (Leaflet + OpenStreetMap hoy, Google Maps o Mapbox mañana) se carga bajo demanda.
 */
export interface MapAdapter {
  name: string
  /** Componente del proveedor, normalmente React.lazy para cargarlo bajo demanda. */
  Component: ComponentType<MapViewProps>
}
