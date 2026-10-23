import { Link } from 'react-router'
import { chipStyles, ErrorState, PageHeader, Photo, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { responsiveImage } from '@/shared/lib/images'
import { restaurantRepository } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { dishRepository } from '../services/dishRepository'

export function DishesPage() {
  const data = useAsync(
    () =>
      Promise.all([
        dishRepository.getAll(),
        dishRepository.getCategories(),
        restaurantRepository.getAll(),
      ]),
    [],
  )
  const [dishes = [], categories = [], restaurants = []] = data.data ?? []
  const count = (dishId: string) => restaurants.filter((r) => r.dishIds.includes(dishId)).length
  const groups = categories
    .map((category) => ({ category, dishes: dishes.filter((d) => d.categoryId === category.id) }))
    .filter((g) => g.dishes.length > 0)

  return (
    <div className="container-page pb-8">
      <Seo
        title="Platillos cubanos: qué pedir y dónde"
        description="Ropa vieja, sándwich cubano, congrí, tostones, café cubano y más: qué es cada platillo y en qué restaurantes de Mérida lo sirven."
        path="/platillos"
      />
      <PageHeader
        title="¿Qué se te antoja?"
        description="Elige un platillo: te contamos qué es y en qué restaurantes lo sirven."
      />
      {data.status === 'loading' && (
        <div aria-hidden className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      )}
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar los platillos." onRetry={data.reload} />
      )}
      {data.status === 'success' && (
        <>
          <nav
            aria-label="Categorías de platillos"
            className="sticky top-22 z-(--z-raised) -mx-4 mb-8 bg-canvas/90 px-4 py-2 backdrop-blur-md tablet:mx-0 tablet:px-0"
          >
            <ul className="scrollbar-none flex gap-2 overflow-x-auto">
              {groups.map(({ category }) => (
                <li key={category.id} className="shrink-0">
                  <a href={`#${category.slug}`} className={chipStyles()}>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col gap-16">
            {groups.map(({ category, dishes: list }) => (
              <section
                key={category.id}
                id={category.slug}
                aria-labelledby={`${category.slug}-t`}
                className="scroll-mt-40"
              >
                <h2 id={`${category.slug}-t`} className="mb-6 text-h2 font-bold text-ink">
                  {category.name}
                </h2>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 tablet:grid-cols-3 desktop:grid-cols-4">
                  {list.map((dish) => {
                    const n = count(dish.id)
                    return (
                      <li key={dish.id}>
                        <Link
                          to={`/platillos/${dish.slug}`}
                          className="group flex flex-col gap-3 rounded-lg"
                        >
                          <Photo
                            {...responsiveImage(dish.image, {
                              ratio: '4/5',
                              sizes: '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw',
                              widths: [320, 480, 640, 960],
                            })}
                            ratio="4/5"
                            zoomOnHover
                          />
                          <span className="flex flex-col gap-1">
                            <span className="font-display text-h3 font-semibold text-ink">
                              {dish.name}
                            </span>
                            <span className="text-small text-ink-muted">{dish.summary}</span>
                            <span className="text-caption font-semibold text-accent-text">
                              {n === 0
                                ? 'Aún sin restaurantes'
                                : n === 1
                                  ? 'En 1 restaurante'
                                  : `En ${n} restaurantes`}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
