import { useDeferredValue, useId, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useNavigate } from 'react-router'
import { Coffee, LayoutGrid, MapPin, Search, SearchX, Store, UtensilsCrossed } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { chipStyles, Dialog, ErrorState, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { cn } from '@/shared/lib/cn'
import { imageUrl } from '@/shared/lib/images'
import { loadSearchEngine } from '../services/siteSearch'
import type { SearchKind, SearchResult } from '../services/searchIndex'

const GROUPS: { kind: SearchKind; label: string; icon: LucideIcon; limit: number }[] = [
  { kind: 'restaurante', label: 'Restaurantes', icon: Store, limit: 4 },
  { kind: 'platillo', label: 'Platillos', icon: UtensilsCrossed, limit: 4 },
  { kind: 'categoria', label: 'Categorías', icon: LayoutGrid, limit: 3 },
  { kind: 'zona', label: 'Zonas', icon: MapPin, limit: 3 },
]

const POPULAR = ['Ropa vieja', 'Sándwich cubano', 'Café cubano', 'Mérida', 'Progreso', 'Cafeterías']

interface Option {
  id: string
  href: string
  result?: SearchResult
  label: string
}

export function SearchDialog({
  initialQuery,
  onClose,
}: {
  initialQuery: string
  onClose: () => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const deferredQuery = useDeferredValue(query)
  const [active, setActive] = useState(0)
  const engine = useAsync(() => loadSearchEngine(), [])
  const navigate = useNavigate()
  const listId = useId()
  const q = deferredQuery.trim()

  const groups = useMemo(() => {
    if (!q || engine.status !== 'success') return []
    const results = engine.data.search(q)
    const nonEmpty = GROUPS.map((g) => ({
      ...g,
      results: results.filter((r) => r.doc.kind === g.kind).slice(0, g.limit),
    }))
      .filter((g) => g.results.length > 0)
      // El grupo con la coincidencia más fuerte va primero ("ropa vieja" → Platillos).
      .sort((a, b) => (b.results[0]?.score ?? 0) - (a.results[0]?.score ?? 0))
    // Índice de la primera opción de cada grupo en la lista plana (para aria-activedescendant).
    return nonEmpty.map((g, i) => ({
      ...g,
      offset: nonEmpty.slice(0, i).reduce((sum, prev) => sum + prev.results.length, 0),
    }))
  }, [q, engine.status, engine.data])

  // Lista plana de opciones navegables con teclado.
  const options: Option[] = useMemo(() => {
    const flat: Option[] = groups.flatMap((g) =>
      g.results.map((result) => ({
        id: `${listId}-${result.doc.id}`,
        href: result.doc.href,
        result,
        label: result.doc.title,
      })),
    )
    if (q) {
      flat.push({
        id: `${listId}-todos`,
        href: `/restaurantes?q=${encodeURIComponent(q)}`,
        label: `Ver todos los restaurantes para "${q}"`,
      })
    }
    return flat
  }, [groups, q, listId])

  const safeActive = Math.min(active, Math.max(options.length - 1, 0))
  const go = (href: string) => {
    onClose()
    navigate(href)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!options.length) return
      const delta = event.key === 'ArrowDown' ? 1 : -1
      const next = (safeActive + delta + options.length) % options.length
      setActive(next)
      document.getElementById(options[next]?.id ?? '')?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = options[safeActive]
      if (option) go(option.href)
      else if (query.trim()) go(`/restaurantes?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const optionClass = (index: number) =>
    cn(
      'flex min-h-14 w-full items-center gap-3 rounded-md px-3 py-2 text-left',
      index === safeActive ? 'bg-surface-sunken' : 'hover:bg-surface-sunken',
    )

  return (
    <Dialog
      open
      onClose={onClose}
      title="Buscar"
      hideTitle
      placement="center"
      className="tablet:mt-[10vh] tablet:mb-auto"
      bodyClassName="px-0 py-0 tablet:px-0"
    >
      <div className="flex flex-col">
        <div className="relative px-5 pb-3 tablet:px-6">
          <Search
            aria-hidden
            size={20}
            className="absolute top-1/2 left-9 -translate-y-[65%] text-ink-muted tablet:left-10"
          />
          <input
            role="combobox"
            aria-expanded={options.length > 0}
            aria-controls={listId}
            aria-activedescendant={options[safeActive]?.id}
            aria-autocomplete="list"
            aria-label="Buscar restaurantes, platillos, categorías o zonas"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoFocus
            value={query}
            placeholder="Ropa vieja, Mérida, cafetería…"
            onChange={(event) => {
              setQuery(event.target.value)
              setActive(0)
            }}
            onKeyDown={onKeyDown}
            className="min-h-13 w-full rounded-md bg-surface-sunken pr-4 pl-12 text-body text-ink placeholder:text-ink-muted focus:ring-2 focus:ring-focus focus:outline-none"
          />
        </div>

        <div className="max-h-[min(60dvh,32rem)] overflow-y-auto px-3 pb-4 tablet:px-4">
          {engine.status === 'error' && (
            <ErrorState
              title="No pudimos preparar la búsqueda."
              onRetry={engine.reload}
              className="mx-2"
            />
          )}
          {!q && (
            <div className="flex flex-col gap-3 px-2 pt-2">
              <p className="text-caption font-semibold text-ink-muted">Búsquedas populares</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className={chipStyles()}
                    onClick={() => setQuery(term)}
                  >
                    {term === 'Café cubano' && <Coffee aria-hidden size={16} />}
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          {q && engine.status === 'loading' && (
            <div aria-hidden className="flex flex-col gap-2 px-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-14 rounded-md" />
              ))}
            </div>
          )}
          {q && engine.status === 'success' && (
            <div
              id={listId}
              role="listbox"
              aria-label="Resultados de búsqueda"
              className="flex flex-col gap-4"
            >
              {groups.length === 0 && (
                <p
                  role="status"
                  className="flex items-center gap-2 px-3 py-4 text-small text-ink-muted"
                >
                  <SearchX aria-hidden size={18} />
                  No encontramos “{q}”. Prueba con un platillo, como congrí, o una zona, como
                  Progreso.
                </p>
              )}
              {groups.map((group) => (
                <div
                  key={group.kind}
                  role="group"
                  aria-label={group.label}
                  className="flex flex-col gap-1"
                >
                  <p aria-hidden className="px-3 text-caption font-semibold text-ink-muted">
                    {group.label}
                  </p>
                  {group.results.map((result, position) => {
                    const i = group.offset + position
                    const Icon = group.icon
                    return (
                      <div
                        key={result.doc.id}
                        id={`${listId}-${result.doc.id}`}
                        role="option"
                        aria-selected={i === safeActive}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => go(result.doc.href)}
                        className={cn(optionClass(i), 'cursor-pointer')}
                      >
                        {result.doc.image ? (
                          <img
                            src={imageUrl(result.doc.image, { width: 96, ratio: '1/1' })}
                            alt=""
                            className="size-10 shrink-0 rounded-sm object-cover"
                          />
                        ) : (
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-surface text-brand">
                            <Icon aria-hidden size={18} />
                          </span>
                        )}
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body font-semibold text-ink">
                            {result.doc.title}
                          </span>
                          {result.doc.subtitle && (
                            <span className="truncate text-small text-ink-muted">
                              {result.doc.subtitle}
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ))}
              {(() => {
                const i = options.length - 1
                return (
                  <div
                    id={`${listId}-todos`}
                    role="option"
                    aria-selected={i === safeActive}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(`/restaurantes?q=${encodeURIComponent(q)}`)}
                    className={cn(
                      optionClass(i),
                      'cursor-pointer text-small font-semibold text-accent-text',
                    )}
                  >
                    <Search aria-hidden size={18} className="ml-3" />
                    Ver todos los restaurantes para “{q}”
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
