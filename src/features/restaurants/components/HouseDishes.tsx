import { Link } from 'react-router'
import { Photo } from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import { dishById } from '@/features/dishes'

/**
 * Platillos de la casa: cada uno lleva a su ficha cultural (/platillos/:slug).
 * Móvil: tira deslizable con scroll-snap. Tablet en adelante: cuadrícula.
 */
export function HouseDishes({ dishIds }: { dishIds: string[] }) {
  const dishes = dishIds.map(dishById).filter((d) => d !== undefined)
  if (dishes.length === 0) return null
  return (
    <ul className="-mx-4 scrollbar-none flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 tablet:mx-0 tablet:grid tablet:grid-cols-3 tablet:gap-y-6 tablet:overflow-visible tablet:px-0">
      {dishes.map((dish) => (
        <li key={dish.id} className="w-[11.5rem] shrink-0 snap-start tablet:w-auto">
          <Link
            to={`/platillos/${dish.slug}`}
            className="group flex flex-col gap-2.5 rounded-lg focus-visible:outline-offset-4"
          >
            <Photo
              {...responsiveImage(dish.image, {
                ratio: '4/3',
                sizes: '(min-width: 1024px) 15rem, (min-width: 768px) 30vw, 45vw',
              })}
              ratio="4/3"
              zoomOnHover
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-h3 font-semibold text-ink group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                {dish.name}
              </span>
              <span className="line-clamp-2 text-small text-ink-muted">{dish.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
