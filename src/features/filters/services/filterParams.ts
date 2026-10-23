import type { PriceLevel, RestaurantType } from '@/features/restaurants'

export type SortOption = 'relevancia' | 'distancia' | 'populares'
export type DirectoryView = 'lista' | 'mapa'

/** Estado del directorio. Se sincroniza 1:1 con los query params (compartible y con historial). */
export interface DirectoryFilters {
  q: string
  /** slug de colonia (todas en Mérida) */
  zona: string | null
  abierto: boolean
  tipos: RestaurantType[]
  servicios: string[]
  precios: PriceLevel[]
  orden: SortOption
  vista: DirectoryView
}

export const DEFAULT_FILTERS: DirectoryFilters = {
  q: '',
  zona: null,
  abierto: false,
  tipos: [],
  servicios: [],
  precios: [],
  orden: 'relevancia',
  vista: 'lista',
}

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'distancia', label: 'Distancia' },
  { value: 'populares', label: 'Más populares' },
]

const TYPES: RestaurantType[] = ['restaurante', 'cafeteria', 'bar', 'comida-para-llevar']
const SORTS = SORT_OPTIONS.map((o) => o.value)

const list = (value: string | null) => (value ? value.split(',').filter(Boolean) : [])

export function parseFilters(params: URLSearchParams): DirectoryFilters {
  const orden = params.get('orden') as SortOption | null
  return {
    q: params.get('q')?.trim() ?? '',
    zona: params.get('zona') || null,
    abierto: params.get('abierto') === '1',
    tipos: list(params.get('tipo')).filter((t): t is RestaurantType =>
      TYPES.includes(t as RestaurantType),
    ),
    servicios: list(params.get('servicio')),
    precios: list(params.get('precio'))
      .map(Number)
      .filter((n): n is PriceLevel => n === 1 || n === 2 || n === 3),
    orden: orden && SORTS.includes(orden) ? orden : 'relevancia',
    vista: params.get('vista') === 'mapa' ? 'mapa' : 'lista',
  }
}

/** Serializa omitiendo valores por defecto (URLs cortas y estables). */
export function serializeFilters(filters: Partial<DirectoryFilters>): URLSearchParams {
  const f = { ...DEFAULT_FILTERS, ...filters }
  const params = new URLSearchParams()
  if (f.q) params.set('q', f.q)
  if (f.zona) params.set('zona', f.zona)
  if (f.abierto) params.set('abierto', '1')
  if (f.tipos.length) params.set('tipo', f.tipos.join(','))
  if (f.servicios.length) params.set('servicio', f.servicios.join(','))
  if (f.precios.length) params.set('precio', [...f.precios].sort().join(','))
  if (f.orden !== 'relevancia') params.set('orden', f.orden)
  if (f.vista !== 'lista') params.set('vista', f.vista)
  return params
}

export function directoryUrl(filters: Partial<DirectoryFilters> = {}): string {
  const query = serializeFilters(filters).toString()
  return query ? `/restaurantes?${query}` : '/restaurantes'
}

/** Cantidad de filtros activos (sin contar búsqueda, orden ni vista). */
export function countActiveFilters(f: DirectoryFilters): number {
  return (
    (f.zona ? 1 : 0) + (f.abierto ? 1 : 0) + f.tipos.length + f.servicios.length + f.precios.length
  )
}
