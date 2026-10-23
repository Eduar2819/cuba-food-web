import { Link } from 'react-router'
import { Photo } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { responsiveImage } from '@/shared/lib/images'
import { cityName, neighborhoodName } from '@/features/zones'
import { getOpenStatus } from '../services/openStatus'
import { typeLabel } from '../services/catalog'
import type { Restaurant } from '../types'
import { OpenStatusLabel } from './OpenStatusLabel'

interface RestaurantRowProps {
  restaurant: Restaurant
  now: Date
  distance?: string
  /** Si se define, la fila selecciona (mapa) en vez de navegar. */
  onSelect?: () => void
  selected?: boolean
}

/** Fila compacta (miniatura + datos). Para listas junto al mapa y "Cerca de ti". */
export function RestaurantRow({
  restaurant: r,
  now,
  distance,
  onSelect,
  selected,
}: RestaurantRowProps) {
  const status = getOpenStatus(r.schedule, r.specialSchedules, now)
  const body = (
    <>
      <Photo
        {...responsiveImage(r.cover, { ratio: '1/1', sizes: '5rem', widths: [160, 240] })}
        ratio="1/1"
        frameClassName="w-20 shrink-0 rounded-md"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-display text-body font-semibold text-ink">{r.name}</span>
        <OpenStatusLabel status={status} className="text-caption" />
        <span className="line-clamp-2 text-caption text-ink-muted">
          {typeLabel(r.type)} en {neighborhoodName(r.address.neighborhoodId)},{' '}
          {cityName(r.address.cityId)}
        </span>
        {distance && <span className="text-caption font-semibold text-ink">{distance}</span>}
      </span>
    </>
  )
  const className = cn(
    'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors duration-(--dur-micro)',
    // Anillo hacia adentro: no lo recorta el contenedor con scroll ni desalinea la fila.
    selected ? 'bg-accent-soft ring-2 ring-accent ring-inset' : 'hover:bg-surface-sunken',
  )
  return onSelect ? (
    <button type="button" onClick={onSelect} aria-pressed={selected} className={className}>
      {body}
    </button>
  ) : (
    <Link to={`/restaurantes/${r.slug}`} className={className}>
      {body}
    </Link>
  )
}
