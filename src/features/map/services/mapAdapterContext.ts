import { createContext, lazy, useContext } from 'react'
import type { MapAdapter } from '../types'

/** Proveedor por defecto: Leaflet + OpenStreetMap. */
export const leafletOsmAdapter: MapAdapter = {
  name: 'leaflet-osm',
  Component: lazy(() => import('./leafletAdapter')),
}

/**
 * Permite cambiar de proveedor sin tocar la UI:
 * <MapAdapterContext value={googleMapsAdapter}>…</MapAdapterContext>
 */
export const MapAdapterContext = createContext<MapAdapter>(leafletOsmAdapter)

export function useMapAdapter(): MapAdapter {
  return useContext(MapAdapterContext)
}
