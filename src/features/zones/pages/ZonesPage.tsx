import { Link } from 'react-router'
import { chipStyles, ErrorState, PageHeader, Photo, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl } from '@/features/filters'
import { Seo } from '@/features/seo'
import { zoneRepository } from '../services/zoneRepository'

const count = (n: number) => (n === 1 ? '1 restaurante' : `${n} restaurantes`)

export function ZonesPage() {
  const data = useAsync(
    () => Promise.all([zoneRepository.getZoneSummaries(), zoneRepository.getNeighborhoods()]),
    [],
  )
  const [zones = [], neighborhoods = []] = data.data ?? []

  return (
    <div className="container-page pb-8">
      <Seo
        title="Zonas: comida cubana en Mérida, Progreso y Valladolid"
        description="Explora los restaurantes cubanos de Yucatán por ciudad y colonia."
        path="/zonas"
      />
      <PageHeader
        title="Zonas"
        description="Cada ciudad tiene su propio ritmo para comer cubano."
      />
      {data.status === 'loading' && (
        <div aria-hidden className="flex flex-col gap-8">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      )}
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar las zonas." onRetry={data.reload} />
      )}
      <ul className="flex flex-col gap-14">
        {zones.map((zone) => (
          <li key={zone.id} className="grid items-center gap-6 tablet:grid-cols-2 tablet:gap-10">
            <Link
              to={`/zonas/${zone.slug}`}
              className="group rounded-lg"
              aria-label={`${zone.name}: ${count(zone.restaurantCount)}`}
            >
              <Photo
                {...responsiveImage(zone.image, {
                  ratio: '3/2',
                  sizes: '(min-width: 768px) 50vw, 100vw',
                })}
                ratio="3/2"
                zoomOnHover
              />
            </Link>
            <div className="flex flex-col gap-3">
              <h2 className="text-h1 font-bold text-ink">
                <Link
                  to={`/zonas/${zone.slug}`}
                  className="hover:underline hover:decoration-2 hover:underline-offset-8"
                >
                  {zone.name}
                </Link>
              </h2>
              <p className="text-small font-semibold text-accent-text">
                {count(zone.restaurantCount)}
              </p>
              <p className="max-w-prose text-body text-ink-muted">{zone.description}</p>
              <ul className="flex flex-wrap gap-2 pt-2" aria-label={`Colonias de ${zone.name}`}>
                {neighborhoods
                  .filter((n) => n.cityId === zone.id)
                  .map((n) => (
                    <li key={n.id}>
                      <Link
                        to={directoryUrl({ q: n.name, zona: zone.slug })}
                        className={chipStyles()}
                      >
                        {n.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
