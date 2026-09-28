import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { DEFAULT_FILTERS, parseFilters, serializeFilters } from '../services/filterParams'
import type { DirectoryFilters } from '../services/filterParams'

/**
 * Filtros del directorio sincronizados con los query params: la URL es la fuente de verdad
 * (compartible, recargable y con botón Atrás). Escribir en el buscador reemplaza la entrada
 * del historial; cambiar filtros crea una nueva.
 */
export function useDirectoryFilters() {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => parseFilters(params), [params])

  const update = useCallback(
    (partial: Partial<DirectoryFilters>, options: { replace?: boolean } = {}) => {
      setParams((current) => serializeFilters({ ...parseFilters(current), ...partial }), {
        replace: options.replace ?? false,
        preventScrollReset: true,
      })
    },
    [setParams],
  )

  const clear = useCallback(() => {
    setParams(
      (current) => {
        const f = parseFilters(current)
        // Limpiar filtros conserva la búsqueda, el orden y la vista.
        return serializeFilters({ ...DEFAULT_FILTERS, q: f.q, orden: f.orden, vista: f.vista })
      },
      { preventScrollReset: true },
    )
  }, [setParams])

  const toggleInList = useCallback(
    <K extends 'tipos' | 'servicios' | 'precios'>(key: K, value: DirectoryFilters[K][number]) => {
      const list = filters[key] as DirectoryFilters[K][number][]
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
      update({ [key]: next } as Partial<DirectoryFilters>)
    },
    [filters, update],
  )

  return { filters, update, clear, toggleInList }
}
