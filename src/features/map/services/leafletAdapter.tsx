import { useEffect, useMemo } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { MapMarker, MapViewProps } from '../types'

/*
 * Implementación Leaflet + OpenStreetMap (sin API key). Solo se descarga cuando
 * se muestra un mapa. Pines con divIcon (sin imágenes, evita el problema de rutas
 * de iconos de Leaflet con Vite) y accesibles por teclado (Tab + Enter).
 */

function pinIcon(marker: MapMarker, selected: boolean) {
  const tone = marker.tone ?? 'default'
  return L.divIcon({
    className: 'sc-pin-wrapper',
    html: `<span class="sc-pin sc-pin--${tone}${selected ? ' sc-pin--selected' : ''}" aria-hidden="true"></span>`,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
  })
}

const userIcon = L.divIcon({
  className: 'sc-pin-wrapper',
  html: '<span class="sc-user-dot" aria-hidden="true"></span>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
})

function FitBounds({ markers, userLocation }: Pick<MapViewProps, 'markers' | 'userLocation'>) {
  const map = useMap()
  const key =
    markers.map((m) => m.id).join('|') +
    (userLocation ? `|${userLocation.lat},${userLocation.lng}` : '')
  useEffect(() => {
    const points = markers.map((m) => [m.position.lat, m.position.lng] as [number, number])
    if (userLocation) points.push([userLocation.lat, userLocation.lng])
    if (points.length === 0) return
    if (points.length === 1) map.setView(points[0]!, 15)
    else map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 15 })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se recalcula cuando cambia el conjunto
  }, [key, map])
  return null
}

function PanToSelected({ selected }: { selected?: MapMarker }) {
  const map = useMap()
  useEffect(() => {
    if (selected) map.panTo([selected.position.lat, selected.position.lng], { animate: true })
  }, [selected, map])
  return null
}

export default function LeafletMapView({
  markers,
  center,
  zoom,
  selectedId,
  onSelect,
  fitToMarkers = true,
  userLocation,
  label,
  interactive = true,
  className,
}: MapViewProps) {
  const selected = useMemo(() => markers.find((m) => m.id === selectedId), [markers, selectedId])

  return (
    <div role="region" aria-label={label} className={className}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        zoomControl={interactive}
        keyboard={interactive}
        attributionControl
        className="sc-map size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fitToMarkers && <FitBounds markers={markers} userLocation={userLocation} />}
        <PanToSelected selected={selected} />
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.position.lat, marker.position.lng]}
            icon={pinIcon(marker, marker.id === selectedId)}
            title={marker.label}
            alt={marker.label}
            keyboard={interactive}
            zIndexOffset={marker.id === selectedId ? 1000 : 0}
            eventHandlers={{ click: () => onSelect?.(marker.id) }}
          />
        ))}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userIcon}
            title="Tu ubicación"
            keyboard={false}
          />
        )}
      </MapContainer>
    </div>
  )
}
