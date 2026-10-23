import { useEffect, useMemo, useState } from 'react'
import { List, Map as MapIcon, Search, SearchX, SlidersHorizontal } from 'lucide-react'
import {
  Button,
  Drawer,
  EmptyState,
  ErrorState,
  Input,
  PageHeader,
  SegmentedControl,
  Select,
  Skeleton,
  SkeletonText,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { normalizeText } from '@/shared/lib/text'
import {
  ActiveFilters,
  applyFilters,
  countActiveFilters,
  facetCounts,
  FiltersPanel,
  SORT_OPTIONS,
  useDirectoryFilters,
} from '@/features/filters'
import type { SortOption } from '@/features/filters'
import { distanceLabel, LocationPrompt, useUserLocation } from '@/features/nearby'
import { loadSearchEngine } from '@/features/search'
import { Seo } from '@/features/seo'
import { neighborhoods } from '@/features/zones'
import { RestaurantCard } from '../components/RestaurantCard'
import { restaurantTypes, services } from '../services/catalog'
import { restaurantRepository } from '../services/restaurantRepository'
import { DirectoryMap } from './DirectoryMap'

const resultsLabel = (n: number, q: string) => {
  const base = n === 0 ? 'Ningún restaurante' : n === 1 ? '1 restaurante' : `${n} restaurantes`
  return q ? `${base} para "${q}"` : base
}

/** Campo de búsqueda del directorio: escribe en ?q= con debounce (reemplaza historial). */
function DirectorySearch({ q, onSearch }: { q: string; onSearch: (q: string) => void }) {
  const [text, setText] = useState(q)
  const [prevQ, setPrevQ] = useState(q)
  // Si ?q= cambia desde fuera (búsqueda global, Atrás), se refleja en el campo.
  if (q !== prevQ) {
    setPrevQ(q)
    if (normalizeText(q) !== normalizeText(text)) setText(q)
  }

  useEffect(() => {
    if (text.trim() === q) return
    const timer = window.setTimeout(() => onSearch(text.trim()), 250)
    return () => window.clearTimeout(timer)
  }, [text, q, onSearch])

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(text.trim())
      }}
    >
      <Input
        label="Buscar en el directorio"
        hideLabel
        type="search"
        leadingIcon={Search}
        placeholder="Restaurante, platillo o colonia"
        value={text}
        onChange={(event) => setText(event.target.value)}
        enterKeyHint="search"
        autoComplete="off"
      />
    </form>
  )
}

function ResultsSkeleton() {
  return (
    <div aria-hidden className="grid gap-x-6 gap-y-10 tablet:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <Skeleton className="h-6 w-1/2" />
          <SkeletonText lines={2} />
        </div>
      ))}
    </div>
  )
}

export function DirectoryPage() {
  const now = useNow()
  const { filters, update, clear, toggleInList } = useDirectoryFilters()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const location = useUserLocation()
  const restaurants = useAsync(() => restaurantRepository.getAll(), [])
  const engine = useAsync(() => loadSearchEngine(), [])

  // "Cerca de mí" es una petición explícita: si se ordena por distancia, se solicita la ubicación.
  const { status: locationStatus, request: requestLocation } = location
  useEffect(() => {
    if (filters.orden === 'distancia' && locationStatus === 'idle') requestLocation()
  }, [filters.orden, locationStatus, requestLocation])

  const searchScores = useMemo(() => {
    if (!filters.q || engine.status !== 'success') return null
    const results = engine.data.search(filters.q, { kinds: ['restaurante'] })
    return new Map(results.map((r) => [r.doc.id.replace('restaurante:', ''), r.score]))
  }, [filters.q, engine.status, engine.data])

  const ctx = useMemo(
    () => ({ now, searchScores, origin: location.location }),
    [now, searchScores, location.location],
  )
  const all = useMemo(() => restaurants.data ?? [], [restaurants.data])
  const items = useMemo(() => applyFilters(all, filters, ctx), [all, filters, ctx])
  const counts = useMemo(
    () => ({
      zona: facetCounts(
        all,
        filters,
        ctx,
        'zona',
        neighborhoods.map((n) => n.slug),
      ),
      tipos: facetCounts(
        all,
        filters,
        ctx,
        'tipos',
        restaurantTypes.map((t) => t.id),
      ),
      servicios: facetCounts(
        all,
        filters,
        ctx,
        'servicios',
        services.map((s) => s.id),
      ),
    }),
    [all, filters, ctx],
  )

  const waitingSearch = Boolean(filters.q) && engine.status === 'loading'
  const loading = restaurants.status === 'loading' || waitingSearch
  const failed = restaurants.status === 'error' || engine.status === 'error'
  const activeCount = countActiveFilters(filters)
  const retry = () => {
    restaurants.reload()
    engine.reload()
  }

  const panel = (
    <FiltersPanel filters={filters} onChange={update} onToggle={toggleInList} counts={counts} />
  )

  return (
    <div className="container-page pb-8">
      <Seo
        title="Restaurantes cubanos en Mérida"
        description="Directorio de restaurantes, cafeterías y bares cubanos en Mérida. Filtra por colonia, horario, servicios y precio."
        path="/restaurantes"
      />
      <PageHeader
        title="Restaurantes cubanos en Mérida"
        description="Filtra por colonia, horario y servicios. Todo lo que ves aquí es un directorio de demostración."
      />

      <div className="grid gap-10 desktop:grid-cols-[16.5rem_1fr] desktop:gap-12">
        <aside aria-labelledby="filtros-titulo" className="hidden desktop:block">
          <div className="sticky top-24 flex max-h-[calc(100dvh-7rem)] flex-col gap-6 overflow-y-auto pr-2 pb-6">
            <h2 id="filtros-titulo" className="text-h3 font-semibold">
              Filtros
            </h2>
            {panel}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <DirectorySearch q={filters.q} onSearch={(q) => update({ q }, { replace: true })} />

          <div className="flex flex-wrap items-center gap-3">
            <p aria-live="polite" className="mr-auto text-body font-semibold text-ink">
              {loading ? 'Buscando…' : resultsLabel(items.length, filters.q)}
            </p>
            <Button
              variant="ghost"
              leadingIcon={SlidersHorizontal}
              onClick={() => setFiltersOpen(true)}
              className="desktop:hidden"
              aria-haspopup="dialog"
            >
              {activeCount ? `Filtros (${activeCount})` : 'Filtros'}
            </Button>
            <Select
              label="Ordenar por"
              hideLabel
              options={SORT_OPTIONS}
              value={filters.orden}
              onChange={(event) => update({ orden: event.target.value as SortOption })}
              containerClassName="w-44"
            />
            <SegmentedControl
              label="Vista"
              value={filters.vista}
              onChange={(vista) => update({ vista })}
              options={[
                { value: 'lista', label: 'Lista', icon: List },
                { value: 'mapa', label: 'Mapa', icon: MapIcon },
              ]}
            />
          </div>

          <ActiveFilters filters={filters} onChange={update} onClear={clear} />

          {filters.orden === 'distancia' && <LocationPrompt compact />}

          {failed ? (
            <ErrorState
              title="No pudimos cargar los restaurantes."
              description="Revisa tu conexión e inténtalo de nuevo."
              onRetry={retry}
            />
          ) : loading ? (
            <ResultsSkeleton />
          ) : items.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No encontramos restaurantes con estos filtros."
              description={
                filters.q
                  ? 'Prueba con otra palabra, por ejemplo un platillo como "congrí" o una colonia como "Centro".'
                  : 'Quita algún filtro o prueba en otra colonia.'
              }
              action={
                <Button
                  variant="secondary"
                  onClick={() => (activeCount ? clear() : update({ q: '' }))}
                >
                  {activeCount ? 'Limpiar filtros' : 'Quitar búsqueda'}
                </Button>
              }
            />
          ) : filters.vista === 'mapa' ? (
            <DirectoryMap items={items} now={now} />
          ) : (
            <ul className="grid animate-[rise-in_var(--dur-normal)_var(--ease-out-soft)] gap-x-6 gap-y-12 tablet:grid-cols-2">
              {items.map(({ restaurant, distanceKm }) => (
                <li key={restaurant.id}>
                  <RestaurantCard
                    restaurant={restaurant}
                    now={now}
                    headingLevel="h2"
                    sizes="(min-width: 1024px) 34vw, (min-width: 768px) 50vw, 100vw"
                    distance={distanceKm !== undefined ? distanceLabel(distanceKm) : undefined}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        footer={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={clear} disabled={!activeCount}>
              Limpiar
            </Button>
            <Button fullWidth onClick={() => setFiltersOpen(false)}>
              {items.length === 0 ? 'Sin resultados' : `Ver ${resultsLabel(items.length, '')}`}
            </Button>
          </div>
        }
      >
        {panel}
      </Drawer>
    </div>
  )
}
