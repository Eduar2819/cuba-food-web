import { X } from 'lucide-react'
import { priceLabel, restaurantTypes, serviceLabel } from '@/features/restaurants'
import { neighborhoods } from '@/features/zones'
import type { DirectoryFilters } from '../services/filterParams'
import { countActiveFilters } from '../services/filterParams'

interface ActiveFiltersProps {
  filters: DirectoryFilters
  onChange: (partial: Partial<DirectoryFilters>) => void
  onClear: () => void
}

interface Pill {
  key: string
  label: string
  remove: Partial<DirectoryFilters>
}

/** Filtros aplicados como pastillas removibles + "Limpiar filtros". */
export function ActiveFilters({ filters: f, onChange, onClear }: ActiveFiltersProps) {
  if (countActiveFilters(f) === 0) return null
  const pills: Pill[] = [
    ...(f.zona
      ? [
          {
            key: 'zona',
            label: neighborhoods.find((n) => n.slug === f.zona)?.name ?? f.zona,
            remove: { zona: null },
          },
        ]
      : []),
    ...(f.abierto ? [{ key: 'abierto', label: 'Abierto ahora', remove: { abierto: false } }] : []),
    ...f.tipos.map((t) => ({
      key: `tipo-${t}`,
      label: restaurantTypes.find((rt) => rt.id === t)?.label ?? t,
      remove: { tipos: f.tipos.filter((x) => x !== t) },
    })),
    ...f.servicios.map((s) => ({
      key: `servicio-${s}`,
      label: serviceLabel(s),
      remove: { servicios: f.servicios.filter((x) => x !== s) },
    })),
    ...f.precios.map((p) => ({
      key: `precio-${p}`,
      label: priceLabel(p),
      remove: { precios: f.precios.filter((x) => x !== p) },
    })),
  ]

  return (
    <div className="flex flex-wrap items-center gap-2">
      <p className="sr-only">Filtros aplicados:</p>
      <ul className="contents">
        {pills.map((pill) => (
          <li key={pill.key}>
            <button
              type="button"
              onClick={() => onChange(pill.remove)}
              aria-label={`Quitar filtro: ${pill.label}`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-brand py-1 pr-2 pl-3.5 text-small font-semibold text-on-brand transition-transform duration-(--dur-micro) ease-out-soft active:scale-[0.97]"
            >
              {pill.label}
              <X aria-hidden size={14} />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClear}
        className="min-h-11 rounded-full px-3 text-small font-semibold text-accent-text underline-offset-4 hover:underline"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
