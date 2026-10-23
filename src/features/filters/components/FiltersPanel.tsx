import type { ReactNode } from 'react'
import { Checkbox, Chip } from '@/shared/design-system'
import { priceLevels, restaurantTypes, services } from '@/features/restaurants'
import type { PriceLevel, RestaurantType } from '@/features/restaurants'
import { neighborhoods } from '@/features/zones'
import type { DirectoryFilters } from '../services/filterParams'

export interface FiltersPanelProps {
  filters: DirectoryFilters
  onChange: (partial: Partial<DirectoryFilters>) => void
  onToggle: <K extends 'tipos' | 'servicios' | 'precios'>(
    key: K,
    value: DirectoryFilters[K][number],
  ) => void
  /** Resultados que quedarían al elegir cada opción. */
  counts: {
    zona: Map<string, number>
    tipos: Map<string, number>
    servicios: Map<string, number>
  }
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="pb-2 font-display text-body font-semibold text-ink">{title}</legend>
      {children}
    </fieldset>
  )
}

const countLabel = (n: number | undefined) =>
  n === undefined ? undefined : `${n} resultado${n === 1 ? '' : 's'}`

/** Filtros del directorio. Se reutiliza en la barra lateral (desktop) y en el bottom sheet (móvil). */
export function FiltersPanel({ filters, onChange, onToggle, counts }: FiltersPanelProps) {
  return (
    <div className="flex flex-col gap-8">
      <Group title="Colonia">
        <div
          role="radiogroup"
          aria-label="Colonia"
          className="flex flex-wrap gap-2"
          onKeyDown={(event) => {
            if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(event.key)) return
            event.preventDefault()
            const radios = Array.from(
              event.currentTarget.querySelectorAll<HTMLButtonElement>(
                '[role="radio"]:not(:disabled)',
              ),
            )
            const index = radios.findIndex((r) => r === document.activeElement)
            const delta = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1
            const next = radios[(index + delta + radios.length) % radios.length]
            next?.focus()
            next?.click()
          }}
        >
          {[
            { slug: null, name: 'Todas' },
            ...neighborhoods.map((n) => ({ slug: n.slug, name: n.name })),
          ].map((zone) => {
            const selected = filters.zona === zone.slug
            const count = zone.slug ? counts.zona.get(zone.slug) : undefined
            return (
              <Chip
                key={zone.slug ?? 'todas'}
                mode="radio"
                selected={selected}
                onClick={() => onChange({ zona: zone.slug })}
                disabled={count === 0 && !selected}
              >
                {zone.name}
                {count !== undefined && <span className="text-caption opacity-70">{count}</span>}
              </Chip>
            )
          })}
        </div>
      </Group>

      <Group title="Horario">
        <Checkbox
          label="Abierto ahora"
          description="Según la hora de Mérida"
          checked={filters.abierto}
          onChange={(event) => onChange({ abierto: event.target.checked })}
        />
      </Group>

      <Group title="Tipo de lugar">
        {restaurantTypes.map((type) => (
          <Checkbox
            key={type.id}
            label={type.label}
            description={countLabel(counts.tipos.get(type.id))}
            checked={filters.tipos.includes(type.id)}
            onChange={() => onToggle('tipos', type.id as RestaurantType)}
          />
        ))}
      </Group>

      <Group title="Servicios">
        {services.map((service) => (
          <Checkbox
            key={service.id}
            label={service.label}
            description={countLabel(counts.servicios.get(service.id))}
            checked={filters.servicios.includes(service.id)}
            onChange={() => onToggle('servicios', service.id)}
          />
        ))}
      </Group>

      <Group title="Precio">
        <div className="flex gap-2">
          {priceLevels.map((level) => (
            <Chip
              key={level.value}
              selected={filters.precios.includes(level.value)}
              onClick={() => onToggle('precios', level.value as PriceLevel)}
              title={level.description}
              aria-label={`${level.label}: ${level.description}`}
            >
              {level.label}
            </Chip>
          ))}
        </div>
      </Group>
    </div>
  )
}
