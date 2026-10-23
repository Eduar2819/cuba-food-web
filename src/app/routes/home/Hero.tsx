import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { chipStyles, TileFlower } from '@/shared/design-system'
import { useParallax } from '@/shared/hooks/useParallax'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_BACKGROUND, HERO_PLATE, HERO_BACKGROUND_OPTIONS } from './heroImages'

const depth = (value: number) => ({ '--parallax-depth': value }) as CSSProperties

/**
 * Hero con parallax en 3 capas:
 * fondo (mesa compartida, 0.35) · medio (plato enmarcado, 0.15) · contenido (0).
 * La imagen de fondo es el LCP: eager + fetchpriority=high + preload en index.html.
 */
export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null)
  useParallax(rootRef)
  const background = responsiveImage(HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS)
  const plate = responsiveImage(HERO_PLATE, {
    ratio: '4/5',
    sizes: '(min-width: 1024px) 30vw, 0px',
    widths: [480, 720, 960],
  })

  return (
    <section aria-labelledby="hero-title" className="px-3 pt-3 tablet:px-4 desktop:px-6">
      <div
        ref={rootRef}
        className="relative isolate flex min-h-[min(calc(100svh-6.5rem),54rem)] overflow-hidden rounded-xl bg-anil-975"
      >
        {/* Capa de fondo */}
        <div
          aria-hidden
          className="parallax-layer absolute inset-x-0 -top-[12%] h-[124%]"
          style={depth(0.35)}
        >
          <img
            {...background}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="size-full object-cover"
          />
        </div>
        {/* Velo para contraste del texto (degradado a la izquierda, donde está el contenido) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-t from-anil-975/90 via-anil-975/55 to-anil-975/25 desktop:bg-linear-to-r desktop:from-anil-975/90 desktop:via-anil-975/65 desktop:to-anil-975/30"
        />

        {/* Capa media: plato enmarcado (doble bisel) */}
        <div
          className="parallax-layer pointer-events-none absolute right-[6%] bottom-[10%] hidden w-[19%] max-w-[18rem] desktop:block"
          style={depth(0.15)}
        >
          <figure className="rotate-[2deg] rounded-xl bg-white/12 p-2 ring-1 ring-white/25">
            <img
              {...plate}
              alt={plate.alt}
              loading="eager"
              className="aspect-[4/5] w-full rounded-[calc(var(--radius-xl)-0.5rem)] object-cover shadow-high"
            />
          </figure>
        </div>

        {/* Capa de contenido */}
        <div className="relative z-(--z-raised) flex w-full flex-col justify-end px-5 pt-28 pb-8 tablet:px-10 tablet:pb-12 desktop:px-14 desktop:pb-16">
          <div className="hero-reveal flex max-w-[40rem] flex-col gap-5 tablet:gap-6">
            <p className="flex items-center gap-3 text-small font-medium tracking-[0.02em] text-arena-100">
              <TileFlower className="size-5 text-mamoncillo-400" />
              Guía de cocina cubana en Mérida, Yucatán
            </p>
            <h1 id="hero-title" className="text-display font-semibold text-arena-50">
              Descubre <em className="text-guayaba-300">Cuba</em> en Mérida
            </h1>
            <p className="max-w-[34rem] text-lead text-arena-100">
              Restaurantes cubanos de la ciudad con sus platillos, redes sociales y cómo llegar.
            </p>
            <SearchBox variant="hero" />
            <nav aria-label="Accesos rápidos" className="-mx-5 tablet:mx-0">
              <ul className="scrollbar-none flex gap-2 overflow-x-auto px-5 tablet:flex-wrap tablet:px-0">
                {QUICK_FILTERS.slice(0, 4).map(({ id, label, icon: Icon, filters }) => (
                  <li key={id} className="shrink-0">
                    <Link to={directoryUrl(filters)} className={chipStyles({ tone: 'onPhoto' })}>
                      <Icon aria-hidden size={16} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              to="/restaurantes"
              className="group inline-flex min-h-11 items-center gap-2 self-start text-body font-semibold text-arena-50 underline decoration-arena-50/40 decoration-1 underline-offset-[6px] transition-colors duration-(--dur-micro) hover:decoration-arena-50"
            >
              Ver el directorio completo
              <ArrowRight
                aria-hidden
                size={18}
                className="transition-transform duration-(--dur-normal) ease-out-soft group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
