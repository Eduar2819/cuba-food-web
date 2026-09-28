import { RESTAURANTS } from '@/data/restaurants'
import { distanceLabel } from '@/features/nearby'
import { toMarkers } from './markers'

describe('mapa', () => {
  it('un marcador por restaurante, con tono según el estado (lunes 3 PM)', () => {
    const markers = toMarkers(RESTAURANTS, new Date('2026-09-28T15:00:00-06:00'))
    expect(markers).toHaveLength(RESTAURANTS.length)
    const byName = Object.fromEntries(markers.map((m) => [m.label, m.tone]))
    expect(byName['Café Mamoncillo']).toBe('open')
    expect(byName['La Habana del Caribe']).toBe('closed')
  })
})

describe('Cerca de ti', () => {
  it('distancia con tiempo aproximado y modo sugerido', () => {
    expect(distanceLabel(0.6)).toBe('600 m · 10 min a pie')
    expect(distanceLabel(4)).toBe('4 km · 11 min en auto')
    expect(distanceLabel(35)).toBe('35 km · 1 h 38 min en auto')
  })
})
