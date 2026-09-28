import { useRef } from 'react'
import { Link } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  ErrorState,
  IconButton,
  Photo,
  Section,
  Skeleton,
  textLinkClass,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { responsiveImage } from '@/shared/lib/images'
import { restaurantRepository } from '@/features/restaurants'
import { dishRepository } from '../services/dishRepository'

const plural = (n: number) => (n === 1 ? '1 restaurante' : `${n} restaurantes`)

/** "¿Qué se te antoja?": carrusel con scroll-snap de platillos populares. */
export function DishCravings() {
  const data = useAsync(
    () => Promise.all([dishRepository.getAll(), restaurantRepository.getAll()]),
    [],
  )
  const trackRef = useRef<HTMLUListElement>(null)

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' })
  }

  const items =
    data.status === 'success'
      ? data.data[0]
          .filter((d) => d.popular)
          .map((dish) => ({
            dish,
            count: data.data[1].filter((r) => r.dishIds.includes(dish.id)).length,
          }))
      : []

  return (
    <Section
      title="¿Qué se te antoja?"
      description="Elige un platillo y te decimos dónde lo sirven."
      action={
        <div className="flex items-center gap-2">
          <Link to="/platillos" className={textLinkClass}>
            Ver todos los platillos
          </Link>
          <div className="ml-2 hidden gap-2 desktop:flex">
            <IconButton
              icon={ChevronLeft}
              label="Platillos anteriores"
              variant="subtle"
              onClick={() => scroll(-1)}
            />
            <IconButton
              icon={ChevronRight}
              label="Más platillos"
              variant="subtle"
              onClick={() => scroll(1)}
            />
          </div>
        </div>
      }
    >
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar los platillos." onRetry={data.reload} />
      )}
      <ul
        ref={trackRef}
        className="-mx-4 scrollbar-none grid snap-x snap-mandatory scroll-px-4 auto-cols-[68%] grid-flow-col gap-4 overflow-x-auto px-4 tablet:-mx-6 tablet:scroll-px-6 tablet:auto-cols-[36%] tablet:px-6 desktop:mx-0 desktop:scroll-px-0 desktop:auto-cols-[calc((100%-4*1.5rem)/5)] desktop:gap-6 desktop:px-0"
      >
        {data.status === 'loading' &&
          Array.from({ length: 5 }, (_, i) => (
            <li key={i} aria-hidden className="flex flex-col gap-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-5 w-2/3" />
            </li>
          ))}
        {items.map(({ dish, count }) => (
          <li key={dish.id} className="snap-start">
            <Link to={`/platillos/${dish.slug}`} className="group flex flex-col gap-3 rounded-lg">
              <Photo
                {...responsiveImage(dish.image, {
                  ratio: '3/4',
                  sizes: '(min-width: 1024px) 20vw, (min-width: 768px) 36vw, 68vw',
                  widths: [320, 480, 640, 960],
                })}
                ratio="3/4"
                zoomOnHover
              />
              <span className="flex flex-col gap-0.5">
                <span className="font-display text-h3 font-semibold text-ink">{dish.name}</span>
                <span className="text-small text-ink-muted">En {plural(count)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  )
}
