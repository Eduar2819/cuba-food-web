import { estimateMinutes, formatDistance, haversineKm, suggestedMode } from './geo'

describe('geo', () => {
  it('Haversine: Mérida centro a Progreso ≈ 33 km', () => {
    const km = haversineKm({ lat: 20.9674, lng: -89.6237 }, { lat: 21.2835, lng: -89.6622 })
    expect(km).toBeGreaterThan(34)
    expect(km).toBeLessThan(36)
  })

  it('distancia cero entre el mismo punto', () => {
    expect(haversineKm({ lat: 20, lng: -89 }, { lat: 20, lng: -89 })).toBe(0)
  })

  it('formatea metros y kilómetros', () => {
    expect(formatDistance(0.347)).toBe('350 m')
    expect(formatDistance(2.46)).toBe('2.5 km')
  })

  it('estima tiempos y sugiere modo', () => {
    expect(suggestedMode(1)).toBe('walk')
    expect(suggestedMode(3)).toBe('drive')
    expect(estimateMinutes(1, 'walk')).toBe(17)
    expect(estimateMinutes(0.01, 'drive')).toBe(1)
  })
})
