import { Link } from 'react-router'
import { ErrorState, Section, Skeleton } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { useAsync } from '@/shared/hooks/useAsync'
import { responsiveImage } from '@/shared/lib/images'
import { zoneRepository } from '../services/zoneRepository'
import type { ZoneSummary } from '../types'

const count = (n: number) => (n === 1 ? '1 restaurante' : `${n} restaurantes`)

function ZoneTile({ zone, large }: { zone: ZoneSummary; large: boolean }) {
  const image = responsiveImage(zone.image, {
    ratio: large ? '4/5' : '16/9',
    sizes: large ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 45vw, 100vw',
  })
  return (
    <Link
      to={`/zonas/${zone.slug}`}
      className={cn(
        'group relative isolate flex overflow-hidden rounded-lg bg-anil-975',
        large ? 'min-h-[22rem] desktop:row-span-2 desktop:min-h-[34rem]' : 'min-h-[14rem]',
      )}
    >
      <img
        {...image}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 size-full object-cover transition-transform duration-(--dur-macro) ease-out-soft group-hover:scale-[1.03]"
      />
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-linear-to-t from-anil-975/85 via-anil-975/30 to-transparent"
      />
      <span className="mt-auto flex flex-col gap-1 p-6 tablet:p-8">
        <span className={cn('font-display font-bold text-arena-50', large ? 'text-h1' : 'text-h2')}>
          {zone.name}
        </span>
        <span className="text-small font-semibold text-arena-100">
          {count(zone.restaurantCount)}
        </span>
        {large && (
          <span className="mt-2 max-w-md text-small text-arena-100">{zone.description}</span>
        )}
      </span>
    </Link>
  )
}

/** Explora por zona: bento de 3 celdas (Mérida grande, Progreso y Valladolid apiladas). */
export function ZonesBento() {
  const zones = useAsync(() => zoneRepository.getZoneSummaries(), [])
  return (
    <Section
      title="Explora por zona"
      description="Cada ciudad tiene su propio ritmo para comer cubano."
    >
      {zones.status === 'loading' && (
        <div aria-hidden className="grid gap-4 desktop:grid-cols-[1.25fr_1fr] desktop:grid-rows-2">
          <Skeleton className="min-h-[22rem] rounded-lg desktop:row-span-2" />
          <Skeleton className="min-h-[14rem] rounded-lg" />
          <Skeleton className="min-h-[14rem] rounded-lg" />
        </div>
      )}
      {zones.status === 'error' && (
        <ErrorState title="No pudimos cargar las zonas." onRetry={zones.reload} />
      )}
      {zones.status === 'success' && (
        <div className="grid gap-4 desktop:grid-cols-[1.25fr_1fr] desktop:grid-rows-2">
          {zones.data.map((zone, i) => (
            <ZoneTile key={zone.id} zone={zone} large={i === 0} />
          ))}
        </div>
      )}
    </Section>
  )
}
