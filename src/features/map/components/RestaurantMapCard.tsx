import { Link } from 'react-router'
import { X } from 'lucide-react'
import { buttonStyles, Card, IconButton, Photo, Rating } from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import { getOpenStatus, OpenStatusLabel, typeLabel } from '@/features/restaurants'
import type { Restaurant } from '@/features/restaurants'
import { cityName, neighborhoodName } from '@/features/zones'

/** Mini card al elegir un marcador: nombre, estado, rating, zona y CTA. */
export function RestaurantMapCard({
  restaurant: r,
  now,
  distance,
  onClose,
}: {
  restaurant: Restaurant
  now: Date
  distance?: string
  onClose: () => void
}) {
  const status = getOpenStatus(r.schedule, r.specialSchedules, now)
  return (
    <Card variant="bezel" padding="none" innerClassName="flex gap-3 p-3">
      <Photo
        {...responsiveImage(r.cover, { ratio: '1/1', sizes: '6rem', widths: [192, 288] })}
        ratio="1/1"
        frameClassName="w-24 shrink-0 rounded-md"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate font-display text-h3 font-semibold text-ink">{r.name}</p>
          <IconButton
            icon={X}
            label="Cerrar tarjeta"
            onClick={onClose}
            className="-mt-2 -mr-2 size-10"
          />
        </div>
        <OpenStatusLabel status={status} className="text-caption" />
        <p className="truncate text-caption text-ink-muted">
          {typeLabel(r.type)} en {neighborhoodName(r.address.neighborhoodId)},{' '}
          {cityName(r.address.cityId)}
          {distance && ` · ${distance}`}
        </p>
        <div className="mt-1 flex items-center justify-between gap-2">
          {r.rating ? <Rating value={r.rating.average} /> : <span />}
          <Link to={`/restaurantes/${r.slug}`} className={buttonStyles({ size: 'sm' })}>
            Ver restaurante
          </Link>
        </div>
      </div>
    </Card>
  )
}
