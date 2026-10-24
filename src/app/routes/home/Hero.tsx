import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { chipStyles } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_IMAGE } from './heroImages'
import { Swoosh } from './HeroArt'

/** Alto del encabezado flotante (pt-3 + píldora): el hero sube por detrás de él. */
const HEADER = '4.75rem'

/**
 * Hero a sangre completa: la ilustración de La Habana ocupa todo el ancho y el alto de la
 * ventana, también detrás del encabezado flotante. Un velo añil (a la izquierda en desktop,
 * desde abajo en móvil) mantiene el texto claro legible sin tapar la escena.
 * La imagen es decorativa (alt vacío) y es el LCP: eager + fetchpriority=high + preload.
 */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      style={{ marginTop: `-${HEADER}` }}
      className="relative isolate flex min-h-[calc(100svh-4.5rem)] overflow-hidden bg-anil-975 desktop:min-h-svh"
    >
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
        className="hero-zoom absolute inset-0 -z-10 size-full object-cover object-[62%_50%] desktop:object-[70%_50%]"
      />
      {/* Velo añil: desde abajo en móvil, desde la izquierda en desktop; arriba, para el encabezado */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(11_22_38/0.94)_0%,rgb(11_22_38/0.82)_45%,rgb(11_22_38/0.35)_75%,rgb(11_22_38/0.25)_100%)] desktop:bg-[linear-gradient(to_right,rgb(11_22_38/0.9)_0%,rgb(11_22_38/0.72)_32%,rgb(11_22_38/0.25)_58%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-40 bg-linear-to-b from-anil-975/45 to-transparent"
      />

      <div
        style={{ paddingTop: `calc(${HEADER} + 2rem)` }}
        className="container-page flex items-end pb-10 tablet:pb-14 desktop:items-center desktop:pb-16"
      >
        <div className="hero-reveal flex w-full max-w-[39rem] min-w-0 flex-col">
          <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-small font-medium text-arena-100 desktop:mb-8">
            <span className="flex items-center gap-2">
              <MapPin
                aria-hidden
                size={18}
                className="fill-mamoncillo-400/20 text-mamoncillo-400"
              />
              Guía de cocina cubana en Mérida, Yucatán
            </span>
            <span aria-hidden className="hidden h-px w-8 bg-arena-100/50 large:block" />
            <span className="hidden font-script text-h3 font-normal text-arena-100 large:inline">
              Sabor · Cultura · Tradición
            </span>
          </p>

          <h1
            id="hero-title"
            className="font-display text-[clamp(2.5rem,min(1.4rem+4.6vw,10svh),5.25rem)] leading-[0.98] font-bold tracking-[-0.025em] text-arena-50 [text-shadow:0_2px_24px_rgb(11_22_38/0.45)]"
          >
            Descubre{' '}
            <span className="relative inline-block font-script text-[1.12em] font-normal tracking-normal text-mamoncillo-400">
              Cuba
              <Swoosh className="hero-draw hero-delay-2 absolute -bottom-[0.12em] left-[8%] w-[92%] text-mamoncillo-400" />
            </span>
            <br />
            en Mérida
          </h1>

          <p className="mt-6 max-w-[32rem] text-lead text-arena-100 desktop:mt-8">
            Los restaurantes cubanos de la ciudad con sus platillos, redes sociales y cómo llegar.
          </p>

          <SearchBox
            variant="hero"
            placeholder="¿Qué se te antoja?"
            className="mt-9 max-w-[36rem] desktop:mt-12"
          />

          <nav aria-label="Accesos rápidos" className="-mx-4 mt-5 tablet:mx-0">
            <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-1 tablet:flex-wrap tablet:gap-2.5 tablet:px-0">
              {QUICK_FILTERS.slice(0, 4).map(({ id, label, icon: Icon, filters }) => (
                <li key={id} className="shrink-0">
                  <Link
                    to={directoryUrl(filters)}
                    className={cn(chipStyles({ tone: 'onPhoto' }), 'px-3.5 shadow-low')}
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
            className="group mt-8 inline-flex min-h-11 items-center gap-2 self-start text-body font-semibold text-arena-50 underline decoration-mamoncillo-400 decoration-2 underline-offset-[7px] transition-colors duration-(--dur-micro) hover:text-mamoncillo-400"
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
    </section>
  )
}
