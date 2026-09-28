import { Link } from 'react-router'
import { ErrorState, Section, Skeleton, SkeletonText, textLinkClass } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { restaurantRepository } from '../services/restaurantRepository'
import { RestaurantCard } from './RestaurantCard'

function FeaturedSkeleton() {
  return (
    <div className="grid gap-8 desktop:grid-cols-12" aria-hidden>
      <div className="flex flex-col gap-3 desktop:col-span-7">
        <Skeleton className="aspect-[4/3] w-full rounded-lg" />
        <Skeleton className="h-7 w-1/2" />
        <SkeletonText lines={2} />
      </div>
      <div className="flex flex-col gap-8 desktop:col-span-5">
        {[0, 1].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <Skeleton className="h-6 w-1/2" />
            <SkeletonText lines={1} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Destacados: composición asimétrica (1 grande + 2 apilados), no una fila de tarjetas iguales. */
export function FeaturedRestaurants({ now }: { now: Date }) {
  const featured = useAsync(() => restaurantRepository.getFeatured(), [])

  const [first, ...rest] = (featured.data ?? [])
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3)

  return (
    <Section
      title="Destacados"
      description="Lugares con buena mesa y mejor sazón para empezar a explorar."
      action={
        <Link to="/restaurantes?orden=populares" className={textLinkClass}>
          Ver todos los restaurantes
        </Link>
      }
    >
      {featured.status === 'loading' && <FeaturedSkeleton />}
      {featured.status === 'error' && (
        <ErrorState title="No pudimos cargar los restaurantes." onRetry={featured.reload} />
      )}
      {featured.status === 'success' && first && (
        <div className="grid gap-10 desktop:grid-cols-12 desktop:gap-8">
          <RestaurantCard
            restaurant={first}
            now={now}
            size="large"
            ratio="4/3"
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="desktop:col-span-7"
          />
          <div className="grid gap-10 tablet:grid-cols-2 desktop:col-span-5 desktop:grid-cols-1 desktop:gap-8">
            {rest.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                now={now}
                ratio="16/9"
                sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
              />
            ))}
          </div>
        </div>
      )}
    </Section>
  )
}
