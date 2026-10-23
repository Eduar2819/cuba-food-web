import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { chipStyles, TileFlower } from '@/shared/design-system'
import { useParallax } from '@/shared/hooks/useParallax'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS, HERO_PLATE } from './heroImages'

const depth = (value: number) => ({ '--parallax-depth': value }) as CSSProperties

/**
 * Hero "Portales": fondo de cal cálida, titular a la izquierda y la comida dentro de arcos
 * de medio punto, como los portales coloniales de La Habana. Detrás, un sol mamoncillo y
 * un panel de losa hidráulica. Los arcos se mueven a distinto ritmo (parallax sutil).
 * La foto del arco grande es el LCP: eager + fetchpriority=high + preload en index.html.
 */
export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  useParallax(rootRef)
  const main = responsiveImage(HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS)
  const side = responsiveImage(HERO_PLATE, {
    ratio: '3/4',
    sizes: '(min-width: 1024px) 16vw, 38vw',
    widths: [320, 480, 720],
  })

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      {/* Luz de tarde: degradado radial cálido, sin bordes duros */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_85%_20%,color-mix(in_oklab,var(--color-mamoncillo-400)_22%,transparent),transparent_70%)]"
      />

      <div className="container-page grid grid-cols-1 items-center gap-12 pt-8 pb-16 tablet:pt-12 desktop:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] desktop:gap-16 desktop:pt-14 desktop:pb-24">
        {/* Texto y búsqueda */}
        <div className="hero-reveal flex max-w-[38rem] min-w-0 flex-col gap-6">
          <p className="flex items-center gap-2.5 text-small font-medium text-ink-muted">
            <TileFlower className="size-5 text-accent" />
            Guía de cocina cubana en Mérida, Yucatán
          </p>
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.75rem,1.6rem+4.4vw,5.25rem)] leading-[0.98] font-bold tracking-[-0.025em] text-ink"
          >
            Descubre <em className="text-accent-text">Cuba</em>
            <br />
            en Mérida
          </h1>
          <p className="max-w-[32rem] text-lead text-ink-muted">
            Los restaurantes cubanos de la ciudad con sus platillos, redes sociales y cómo llegar.
          </p>
          <SearchBox variant="hero" className="max-w-[34rem]" />
          <nav aria-label="Accesos rápidos" className="-mx-4 tablet:mx-0">
            <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 tablet:flex-wrap tablet:px-0">
              {QUICK_FILTERS.slice(0, 4).map(({ id, label, icon: Icon, filters }) => (
                <li key={id} className="shrink-0">
                  <Link to={directoryUrl(filters)} className={chipStyles()}>
                    <Icon aria-hidden size={16} />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <Link
            to="/restaurantes"
            className="group inline-flex min-h-11 items-center gap-2 self-start text-body font-semibold text-ink underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors duration-(--dur-micro) hover:decoration-ink"
          >
            Ver el directorio completo
            <ArrowRight
              aria-hidden
              size={18}
              className="transition-transform duration-(--dur-normal) ease-out-soft group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Portales: composición fotográfica */}
        <div className="relative mx-auto aspect-[6/5] w-full max-w-[34rem] tablet:aspect-[5/4] desktop:mx-0 desktop:ml-auto desktop:aspect-[4/5]">
          {/* Panel de losa hidráulica */}
          <div
            aria-hidden
            className="absolute top-[8%] right-0 bottom-0 left-[14%] rounded-xl bg-surface-sunken"
          >
            <div className="ornament-losa absolute inset-0 rounded-xl text-accent/12 [--losa-size:56px]" />
          </div>
          {/* Sol de la tarde */}
          <div
            aria-hidden
            className="parallax-layer absolute top-0 left-[6%] aspect-square w-[30%] rounded-full bg-mamoncillo-400"
            style={depth(0.1)}
          />

          {/* Arco grande */}
          <div
            className="parallax-layer absolute top-[4%] right-[6%] bottom-[6%] w-[64%]"
            style={depth(0.04)}
          >
            <img
              {...main}
              alt={main.alt}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="size-full rounded-t-full rounded-b-lg object-cover shadow-high ring-[6px] ring-canvas"
            />
          </div>

          {/* Arco pequeño */}
          <div
            className="parallax-layer absolute bottom-0 left-0 h-[52%] w-[38%]"
            style={depth(0.12)}
          >
            <img
              {...side}
              alt={side.alt}
              loading="eager"
              className="size-full rounded-t-full rounded-b-lg object-cover shadow-high ring-[6px] ring-canvas"
            />
          </div>

          {/* Etiqueta del platillo: lleva a su ficha */}
          <Link
            to="/platillos/ropa-vieja"
            className="group absolute right-0 bottom-[12%] flex items-center gap-3 rounded-lg bg-surface py-2.5 pr-3 pl-4 shadow-medium ring-1 ring-line transition-[box-shadow,transform] duration-(--dur-normal) ease-out-soft hover:-translate-y-0.5 hover:shadow-high"
          >
            <span className="flex flex-col">
              <span className="font-display text-body leading-tight font-semibold text-ink">
                Ropa vieja
              </span>
              <span className="text-caption text-ink-muted">El clásico de la isla</span>
            </span>
            <span className="grid size-8 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-(--dur-normal) ease-out-soft group-hover:translate-x-0.5">
              <ArrowRight aria-hidden size={16} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
