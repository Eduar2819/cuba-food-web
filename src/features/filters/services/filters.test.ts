import { RESTAURANTS } from '@/data/restaurants'
import { applyFilters, facetCounts } from './applyFilters'
import {
  countActiveFilters,
  DEFAULT_FILTERS,
  directoryUrl,
  parseFilters,
  serializeFilters,
} from './filterParams'
import type { DirectoryFilters } from './filterParams'

// Lunes 28/09/2026 a las 15:00 en Mérida.
const now = new Date('2026-09-28T15:00:00-06:00')
const f = (partial: Partial<DirectoryFilters>): DirectoryFilters => ({
  ...DEFAULT_FILTERS,
  ...partial,
})
const names = (partial: Partial<DirectoryFilters>, ctx = {}) =>
  applyFilters(RESTAURANTS, f(partial), { now, ...ctx }).map((i) => i.restaurant.name)

describe('query params', () => {
  it('ida y vuelta sin perder información', () => {
    const filters = f({
      q: 'ropa vieja',
      zona: 'centro',
      abierto: true,
      tipos: ['restaurante', 'cafeteria'],
      servicios: ['delivery'],
      precios: [2, 1],
      orden: 'populares',
      vista: 'mapa',
    })
    const parsed = parseFilters(serializeFilters(filters))
    expect(parsed).toEqual({ ...filters, precios: [1, 2] })
  })

  it('omite valores por defecto e ignora valores inválidos', () => {
    expect(directoryUrl()).toBe('/restaurantes')
    expect(directoryUrl({ abierto: true })).toBe('/restaurantes?abierto=1')
    const parsed = parseFilters(new URLSearchParams('tipo=nave,cafeteria&precio=9,2&orden=xyz'))
    expect(parsed.tipos).toEqual(['cafeteria'])
    expect(parsed.precios).toEqual([2])
    expect(parsed.orden).toBe('relevancia')
  })

  it('cuenta filtros activos (sin búsqueda, orden ni vista)', () => {
    expect(
      countActiveFilters(f({ q: 'x', orden: 'populares', tipos: ['bar'], abierto: true })),
    ).toBe(2)
  })
})

describe('applyFilters', () => {
  it('filtra por colonia, tipo, servicio y precio', () => {
    expect(names({ zona: 'garcia-gineres' })).toEqual(['Habana 1959'])
    expect(names({ zona: 'no-existe' })).toEqual([])
    expect(names({ tipos: ['cafeteria'] })).toEqual(['Café Mamoncillo'])
    expect(names({ servicios: ['delivery'], precios: [1] }).sort()).toEqual([
      'Café Mamoncillo',
      'Tostones & Co.',
    ])
  })

  it('"abierto ahora" excluye cerrados (lunes 3 PM)', () => {
    const open = names({ abierto: true })
    expect(open).toContain('Café Mamoncillo')
    expect(open).not.toContain('La Habana del Caribe') // cierra los lunes
  })

  it('ordena por popularidad', () => {
    expect(names({ orden: 'populares' })[0]).toBe('Café Mamoncillo')
  })

  it('ordena por distancia con ubicación; sin ubicación cae a relevancia', () => {
    const norte = { lat: 21.0199, lng: -89.589 }
    const byDistance = applyFilters(RESTAURANTS, f({ orden: 'distancia' }), {
      now,
      origin: norte,
    })
    expect(byDistance[0]?.restaurant.name).toBe('Café Mamoncillo')
    expect(byDistance[0]?.distanceKm).toBeLessThan(1)
    expect(names({ orden: 'distancia' })).toEqual(names({}))
  })

  it('con búsqueda solo deja coincidencias y ordena por puntuación', () => {
    const scores = new Map([
      ['r-tostones-co', 5],
      ['r-habana-caribe', 9],
    ])
    expect(names({ q: 'x' }, { searchScores: scores })).toEqual([
      'La Habana del Caribe',
      'Tostones & Co.',
    ])
  })

  it('conteos por faceta respetan los demás filtros', () => {
    const counts = facetCounts(RESTAURANTS, f({ tipos: ['cafeteria'] }), { now }, 'zona', [
      'centro',
      'norte',
    ])
    expect(Object.fromEntries(counts)).toEqual({ centro: 0, norte: 1 })
  })
})
