import { Link, useParams } from 'react-router'
import { SearchX, UtensilsCrossed } from 'lucide-react'
import {
  Breadcrumbs,
  buttonStyles,
  EmptyState,
  ErrorState,
  Photo,
  Skeleton,
  SkeletonText,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { responsiveImage } from '@/shared/lib/images'
import { restaurantRepository, RestaurantCard } from '@/features/restaurants'
import { breadcrumbJsonLd, Seo } from '@/features/seo'
import { dishCategories, dishRepository } from '../services/dishRepository'

/** Platillo → restaurantes que lo ofrecen → restaurante. */
export function DishPage() {
  const { slug = '' } = useParams()
  const now = useNow()
  const data = useAsync(async () => {
    const dish = await dishRepository.getBySlug(slug)
    const restaurants = dish ? await restaurantRepository.getByDish(dish.id) : []
    return { dish, restaurants }
  }, [slug])

  if (data.status === 'loading')
    return (
      <div aria-hidden className="container-page grid gap-8 pt-10 desktop:grid-cols-2">
        <Skeleton className="aspect-[4/3] rounded-lg" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-2/3" />
          <SkeletonText lines={5} />
        </div>
      </div>
    )
  if (data.status === 'error')
    return (
      <div className="container-page py-12">
        <ErrorState title="No pudimos cargar este platillo." onRetry={data.reload} />
      </div>
    )

  const { dish, restaurants } = data.data
  if (!dish)
    return (
      <div className="container-page py-12">
        <title>Platillo no encontrado | Sabor Cubano</title>
        <EmptyState
          icon={SearchX}
          headingLevel="h1"
          title="No encontramos este platillo."
          action={
            <Link to="/platillos" className={buttonStyles({ variant: 'secondary' })}>
              Ver todos los platillos
            </Link>
          }
        />
      </div>
    )

  const category = dishCategories.find((c) => c.id === dish.categoryId)
  const path = `/platillos/${dish.slug}`
  const sorted = [...restaurants].sort((a, b) => b.popularity - a.popularity)

  return (
    <div className="container-page pt-6 pb-10">
      <Seo
        title={`${dish.name}: qué es y dónde comerlo en Mérida`}
        description={`${dish.summary} Restaurantes cubanos en Mérida que sirven ${dish.name.toLowerCase()}.`}
        path={path}
        image={dish.image}
        jsonLd={breadcrumbJsonLd([
          { name: 'Platillos', path: '/platillos' },
          { name: dish.name, path },
        ])}
      />
      <Breadcrumbs
        items={[
          {
            label: 'Platillos',
            link: (
              <Link to="/platillos" className="hover:text-ink hover:underline">
                Platillos
              </Link>
            ),
          },
          { label: dish.name },
        ]}
      />
      <div className="grid items-center gap-8 pt-6 desktop:grid-cols-[1.1fr_1fr] desktop:gap-14">
        <Photo
          {...responsiveImage(dish.image, {
            ratio: '4/3',
            sizes: '(min-width: 1024px) 55vw, 100vw',
          })}
          ratio="4/3"
          priority
          frameClassName="rounded-xl"
        />
        <div className="flex flex-col gap-5">
          {category && (
            <Link
              to={`/platillos#${category.slug}`}
              className="self-start text-small font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {category.name}
            </Link>
          )}
          <h1 className="text-display font-bold text-ink">{dish.name}</h1>
          <p className="text-lead text-ink">{dish.summary}</p>
          <p className="max-w-prose text-body text-ink-muted">{dish.story}</p>
          {dish.keywords.length > 0 && (
            <p className="text-small text-ink-muted">
              También lo encuentras como: {dish.keywords.slice(0, 3).join(', ')}.
            </p>
          )}
        </div>
      </div>

      <section aria-labelledby="donde" className="pt-16">
        <h2 id="donde" className="text-h2 font-bold text-ink">
          Dónde comer {dish.name.toLowerCase()}
        </h2>
        <p className="pt-2 pb-8 text-body text-ink-muted">
          {sorted.length === 0
            ? 'Todavía ningún restaurante de la guía lo tiene en su menú.'
            : sorted.length === 1
              ? '1 restaurante lo sirve.'
              : `${sorted.length} restaurantes lo sirven.`}
        </p>
        {sorted.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="Sin restaurantes por ahora."
            action={
              <Link to="/platillos" className={buttonStyles({ variant: 'secondary' })}>
                Ver otros platillos
              </Link>
            }
          />
        ) : (
          <ul className="grid gap-x-6 gap-y-12 tablet:grid-cols-2 desktop:grid-cols-3">
            {sorted.map((restaurant) => (
              <li key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} now={now} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
