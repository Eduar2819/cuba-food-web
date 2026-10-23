import { Link } from 'react-router'
import { Badge, Photo } from '@/shared/design-system'
import type { PhotoRatio } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { responsiveImage } from '@/shared/lib/images'
import { FavoriteButton } from '@/features/favorites'
import { cityName, neighborhoodName } from '@/features/zones'
import { getOpenStatus } from '../services/openStatus'
import { priceLabel, typeLabel } from '../services/catalog'
import type { Restaurant } from '../types'
import { OpenStatusLabel } from './OpenStatusLabel'

export interface RestaurantCardProps {
  restaurant: Restaurant
  now: Date
  size?: 'default' | 'large'
  ratio?: PhotoRatio
  /** Atributo sizes de la imagen según el layout donde se usa. */
  sizes?: string
  /** Distancia ya formateada ("1.2 km · 5 min en auto"). */
  distance?: string
  headingLevel?: 'h2' | 'h3'
  className?: string
}

/**
 * Tarjeta de restaurante: la foto es la protagonista y el texto va sin caja.
 * Toda la tarjeta es clicable (enlace extendido); Guardar queda por encima.
 */
export function RestaurantCard({
  restaurant: r,
  now,
  size = 'default',
  ratio = '4/3',
  sizes = '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw',
  distance,
  headingLevel: Heading = 'h3',
  className,
}: RestaurantCardProps) {
  const status = getOpenStatus(r.schedule, r.specialSchedules, now)
  return (
    <article className={cn('group relative flex flex-col gap-3', className)}>
      <div className="relative">
        <Photo {...responsiveImage(r.cover, { ratio, sizes })} ratio={ratio} zoomOnHover />
        <FavoriteButton
          restaurantId={r.id}
          restaurantName={r.name}
          className="absolute top-3 right-3 z-(--z-raised)"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Heading className={cn('font-semibold text-ink', size === 'large' ? 'text-h2' : 'text-h3')}>
          <Link
            to={`/restaurantes/${r.slug}`}
            className="rounded-sm after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
          >
            {r.name}
          </Link>
        </Heading>
        {size === 'large' && <p className="max-w-prose text-body text-ink-muted">{r.tagline}</p>}
        <OpenStatusLabel status={status} />
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-ink-muted">
          <span>
            {typeLabel(r.type)} en {neighborhoodName(r.address.neighborhoodId)},{' '}
            {cityName(r.address.cityId)}
          </span>
          <span aria-label={`Precio: ${priceLabel(r.priceLevel)}`}>
            · {priceLabel(r.priceLevel)}
          </span>
          {distance && <span className="font-medium text-ink">· {distance}</span>}
          {r.isDemo && (
            <Badge tone="demo" className="ml-auto" title="Datos de demostración">
              Demo
            </Badge>
          )}
        </p>
      </div>
    </article>
  )
}
