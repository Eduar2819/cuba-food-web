import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { chipStyles } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS, HERO_PLATE, HERO_STREET } from './heroImages'
import { PalmFrond, Sparkle, Swoosh, TornEdge } from './HeroArt'

/** Foto tipo polaroid con nota manuscrita opcional. */
function Polaroid({
  image,
  sizes,
  caption,
  className,
}: {
  image: ReturnType<typeof responsiveImage>
  sizes: string
  /** Nota manuscrita en dos líneas. */
  caption?: [string, string]
  className?: string
}) {
  return (
    <figure
      className={cn(
        // Papel siempre claro (también en modo oscuro). Relleno fijo: en % se calcularía sobre el collage.
        'absolute rounded-md bg-arena-50 p-2 shadow-high ring-1 ring-anil-950/8 tablet:p-2.5 desktop:p-3',
        caption ? 'pb-14 tablet:pb-[4.5rem] desktop:pb-20' : 'pb-2 tablet:pb-2.5 desktop:pb-3',
        className,
      )}
    >
      <img
        {...image}
        sizes={sizes}
        alt={image.alt}
        loading="eager"
        decoding="async"
        className="aspect-[4/5] w-full rounded-sm object-cover"
      />
      {caption && (
        <figcaption className="absolute right-3 bottom-2 left-4 -rotate-6 font-script text-[clamp(1rem,0.65rem+0.85vw,1.5rem)] leading-[1.05] text-anil-950">
          {caption[0]}
          <br />
          <span className="pl-[0.6em]">{caption[1]}</span>
          <Swoosh className="mt-0.5 w-[62%] text-anil-950" />
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Hero "Collage habanero": papel cálido a la izquierda con el titular y la búsqueda; a la
 * derecha la mesa servida con papel rasgado, sol guayaba, círculo añil, hoja de palma y
 * polaroids con notas a mano. Toda la decoración es aria-hidden; el texto real queda en HTML.
 * La foto grande es el LCP: eager + fetchpriority=high + preload en index.html.
 */
export function Hero() {
  const main = responsiveImage(HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS)
  const mojito = responsiveImage(HERO_PLATE, { ratio: '4/5', widths: [320, 480, 640] })
  const street = responsiveImage(HERO_STREET, { ratio: '4/5', widths: [320, 480] })

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Texto y collage dentro del mismo contenedor que el encabezado: márgenes simétricos */}
      <div className="container-page desktop:grid desktop:min-h-[min(calc(100svh-5.5rem),44rem)] desktop:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] desktop:gap-10 desktop:py-8">
        {/* Texto y búsqueda */}
        <div className="relative z-(--z-raised) flex items-center pt-8 pb-12 desktop:py-8">
          <div className="hero-reveal flex w-full max-w-[38rem] min-w-0 flex-col gap-6">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-small font-medium text-ink-muted">
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
                <Swoosh className="absolute -bottom-[0.12em] left-[8%] w-[92%] text-accent" />
              </span>
              <br />
              en Mérida
            </h1>

            <p className="max-w-[32rem] text-lead text-ink-muted">
              Los restaurantes cubanos de la ciudad con sus platillos, redes sociales y cómo llegar.
            </p>

            <SearchBox variant="hero" className="max-w-[36rem]" />

            <nav aria-label="Accesos rápidos" className="-mx-4 tablet:mx-0">
              <ul className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-1 tablet:flex-wrap tablet:px-0">
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
              className="group inline-flex min-h-11 items-center gap-2 self-start text-body font-semibold text-ink underline decoration-accent decoration-2 underline-offset-[7px] transition-colors duration-(--dur-micro) hover:text-accent-text"
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

        {/* Collage: la mesa servida */}
        <div className="relative mt-2 mb-10 aspect-[4/3] tablet:mt-6 desktop:m-0 desktop:aspect-auto">
          <div className="absolute inset-0 overflow-hidden rounded-xl desktop:rounded-l-none">
            <img
              {...main}
              alt={main.alt}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="size-full object-cover"
            />
            {/* Velo cálido arriba a la derecha para la nota manuscrita */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_10%,rgb(11_22_38/0.55),transparent_70%)]"
            />
            {/* Sol guayaba arriba y círculo añil abajo, recortados por el marco de la foto */}
            <div
              aria-hidden
              className="absolute -top-[16%] left-[12%] aspect-square w-[26%] rounded-full bg-guayaba-600 desktop:-top-[14%] desktop:left-[14%] desktop:w-[28%]"
            />
            <div
              aria-hidden
              className="absolute -bottom-[20%] left-[32%] aspect-square w-[34%] rounded-full bg-anil-700 desktop:-bottom-[22%]"
            />
            {/* Papel rasgado sobre el borde izquierdo de la foto */}
            <TornEdge className="absolute inset-y-0 -left-px hidden h-full w-10 text-canvas drop-shadow-[3px_0_4px_rgb(43_37_30/0.18)] desktop:block" />
          </div>

          <PalmFrond className="absolute top-[6%] left-0 w-[26%] -rotate-[20deg] text-palma-700 drop-shadow-[0_6px_10px_rgb(11_22_38/0.25)] desktop:-left-[6%] desktop:w-[28%]" />

          {/* Nota manuscrita sobre la foto */}
          <p
            aria-hidden
            className="absolute top-[9%] right-[8%] flex -rotate-12 flex-col items-end font-script text-[clamp(1.5rem,0.9rem+1.8vw,2.6rem)] leading-[0.95] text-arena-50 [text-shadow:0_2px_12px_rgb(11_22_38/0.6)] desktop:top-[14%] desktop:right-[22%]"
          >
            <span className="flex items-start gap-1">
              <Sparkle className="mt-1 size-[0.7em] -scale-x-100 text-arena-50" />
              Auténtico
            </span>
            <span>Sabor Cubano</span>
            <Swoosh className="w-[85%] text-arena-50" />
          </p>

          <Polaroid
            image={mojito}
            sizes="(min-width: 1024px) 14vw, 34vw"
            caption={['El clásico', 'de la isla']}
            className="top-[24%] left-[3%] w-[30%] -rotate-[7deg] tablet:w-[24%] desktop:top-[30%] desktop:left-[7%] desktop:w-[24%]"
          />
          <Polaroid
            image={street}
            sizes="(min-width: 1024px) 11vw, 0px"
            className="hidden rotate-[5deg] tablet:top-[52%] tablet:left-[48%] tablet:block tablet:w-[21%] desktop:top-[60%] desktop:left-[50%] desktop:w-[19%]"
          />

          {/* Tarjeta: lleva al mapa */}
          <Link
            to="/mapa"
            className="group absolute right-[3%] -bottom-[6%] flex items-center gap-3 rounded-lg bg-surface py-3 pr-3 pl-4 shadow-high ring-1 ring-line transition-[box-shadow,transform] duration-(--dur-normal) ease-out-soft hover:-translate-y-0.5 desktop:right-[4%] desktop:bottom-[18%]"
          >
            <MapPin aria-hidden size={20} className="shrink-0 fill-accent/15 text-accent" />
            <span className="flex flex-col pr-2">
              <span className="text-small font-semibold text-ink">La Habana en Mérida</span>
              <span className="text-caption text-ink-muted">Comida cubana auténtica</span>
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
