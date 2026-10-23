import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { chipStyles } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_IMAGE } from './heroImages'
import { Swoosh } from './HeroArt'

/**
 * Hero con la ilustración de La Habana como fondo, dentro de un marco alineado al encabezado
 * (la imagen mide 1672px: a sangre completa se vería borrosa en pantallas anchas).
 * La imagen se funde con el papel crema del lado del texto: arriba en móvil, a la izquierda
 * en desktop. Es decorativa (alt vacío) y es el LCP: eager + fetchpriority=high + preload.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="container-page pt-3 pb-6 desktop:pt-4">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-canvas ring-1 ring-line desktop:min-h-[min(calc(100svh-6.5rem),46rem)] desktop:rounded-[2.25rem]">
        {/* Fondo: ilustración (zoom lento al cargar) */}
        <img
          src={HERO_IMAGE.src}
          srcSet={HERO_IMAGE.srcSet}
          sizes={HERO_IMAGE.sizes}
          width={HERO_IMAGE.width}
          height={HERO_IMAGE.height}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          className="hero-zoom absolute inset-x-0 top-0 -z-10 h-[19rem] w-full object-cover object-[72%_50%] tablet:h-[26rem] desktop:inset-0 desktop:h-full desktop:object-[80%_50%]"
        />
        {/* Fusión con el papel: hacia abajo en móvil, hacia la izquierda en desktop */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,transparent_0,transparent_8rem,var(--color-canvas)_16.5rem)] tablet:bg-[linear-gradient(to_bottom,transparent_0,transparent_12rem,var(--color-canvas)_21.5rem)] desktop:bg-[linear-gradient(to_right,var(--color-canvas)_0%,color-mix(in_oklab,var(--color-canvas)_94%,transparent)_34%,color-mix(in_oklab,var(--color-canvas)_55%,transparent)_50%,transparent_68%)]"
        />
        {/* Marco interior fino: acabado de lámina enmarcada */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-2.5 rounded-[1.4rem] border border-arena-50/45 desktop:inset-3.5 desktop:rounded-[1.85rem]"
        />

        <div className="flex h-full items-center px-5 pt-[17rem] pb-10 tablet:px-10 tablet:pt-[22rem] tablet:pb-12 desktop:min-h-[inherit] desktop:px-14 desktop:py-16 large:px-16">
          <div className="hero-reveal flex w-full max-w-[39rem] min-w-0 flex-col">
            <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-small font-medium text-ink-muted desktop:mb-8">
              <span className="flex items-center gap-2">
                <MapPin aria-hidden size={18} className="fill-accent/15 text-accent" />
                Guía de cocina cubana en Mérida, Yucatán
              </span>
              <span aria-hidden className="hidden h-px w-8 bg-line-strong large:block" />
              <span className="hidden font-script text-h3 font-normal text-ink-muted large:inline">
                Sabor · Cultura · Tradición
              </span>
            </p>

            <h1
              id="hero-title"
              className="font-display text-[clamp(2.75rem,1.4rem+4.6vw,5.25rem)] leading-[0.98] font-bold tracking-[-0.025em] text-ink"
            >
              Descubre{' '}
              <span className="relative inline-block font-script text-[1.12em] font-normal tracking-normal text-accent-text">
                Cuba
                <Swoosh className="hero-draw hero-delay-2 absolute -bottom-[0.12em] left-[8%] w-[92%] text-accent" />
              </span>
              <br />
              en Mérida
            </h1>

            <p className="mt-6 max-w-[32rem] text-lead text-ink-muted desktop:mt-8">
              Los restaurantes cubanos de la ciudad con sus platillos, redes sociales y cómo llegar.
            </p>

            <SearchBox variant="hero" className="mt-9 max-w-[36rem] desktop:mt-12" />

            <nav aria-label="Accesos rápidos" className="-mx-4 mt-5 tablet:mx-0">
              <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-1 tablet:flex-wrap tablet:gap-2.5 tablet:px-0">
                {QUICK_FILTERS.slice(0, 4).map(({ id, label, icon: Icon, filters }) => (
                  <li key={id} className="shrink-0">
                    <Link
                      to={directoryUrl(filters)}
                      className={cn(chipStyles(), 'px-3.5 shadow-low ring-line')}
                    >
                      <Icon aria-hidden size={17} />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <Link
              to="/restaurantes"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 self-start text-body font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[7px] transition-colors duration-(--dur-micro) hover:text-accent-text"
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
