import { Link } from 'react-router'
import { ArrowRight, MapPin } from 'lucide-react'
import { chipStyles } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { responsiveImage } from '@/shared/lib/images'
import { directoryUrl, QUICK_FILTERS } from '@/features/filters'
import { SearchBox } from '@/features/search'
import { HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS, HERO_PLATE, HERO_STREET } from './heroImages'
import { PalmFrond, Sparkle, Swoosh } from './HeroArt'

/** Arco de medio punto (portal habanero): radio circular según el ancho disponible. */
const ARCH = 'rounded-t-[9rem] rounded-b-xl tablet:rounded-t-[15rem] desktop:rounded-t-[999px]'

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
        'hero-drop absolute rounded-md bg-arena-50 p-2 shadow-high ring-1 ring-anil-950/8 tablet:p-2.5 desktop:p-3',
        'transition-[rotate,scale] duration-(--dur-macro) ease-spring hover:scale-[1.04] hover:rotate-0',
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
          <Swoosh className="hero-draw hero-delay-5 mt-0.5 w-[62%] text-anil-950" />
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Hero "Collage habanero": papel cálido a la izquierda con el titular y la búsqueda; a la
 * derecha la mesa servida dentro de un arco, sol guayaba, círculo añil, hoja de
 * palma y polaroids con notas a mano que rompen el marco. Toda la decoración es aria-hidden;
 * el texto real queda en HTML.
 * La foto grande es el LCP: eager + fetchpriority=high + preload en index.html.
 */
export function Hero() {
  const main = responsiveImage(HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS)
  const mojito = responsiveImage(HERO_PLATE, { ratio: '4/5', widths: [320, 480, 640] })
  const street = responsiveImage(HERO_STREET, { ratio: '4/5', widths: [320, 480] })

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* Texto y collage dentro del mismo contenedor que el encabezado: márgenes simétricos */}
      <div className="container-page desktop:grid desktop:min-h-[min(calc(100svh-5.5rem),50rem)] desktop:grid-cols-[minmax(0,1.04fr)_minmax(0,1fr)] desktop:gap-12 desktop:pt-10 desktop:pb-16 large:gap-20 large:pt-14 large:pb-20">
        {/* Texto y búsqueda */}
        <div className="relative z-(--z-raised) flex items-center pt-10 pb-14 tablet:pt-14 desktop:py-6">
          <div className="hero-reveal flex w-full max-w-[38rem] min-w-0 flex-col">
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

        {/*
         * Collage: la mesa servida dentro de un arco (portal habanero). Sol, círculo y
         * polaroids rompen el marco para que la composición tenga capas y no se lea como una
         * imagen de fondo.
         */}
        <div className="relative mx-2 mb-14 aspect-[4/5] tablet:mx-6 tablet:mb-16 tablet:aspect-[5/4] desktop:m-0 desktop:aspect-auto">
          {/* Detrás del arco: sol guayaba, círculo añil y contorno desplazado */}
          <div
            aria-hidden
            className="hero-pop hero-delay-1 absolute -top-[6%] -left-[3%] aspect-square w-[24%] rounded-full bg-guayaba-600 desktop:-top-[3%] desktop:-left-[6%] desktop:w-[30%]"
          />
          <div
            aria-hidden
            className="hero-pop hero-delay-2 absolute -bottom-[7%] -left-[4%] aspect-square w-[22%] rounded-full bg-anil-700 desktop:-bottom-[6%] desktop:-left-[8%] desktop:w-[26%]"
          />
          <div
            aria-hidden
            className={cn(
              ARCH,
              'hero-fade hero-delay-3 absolute inset-0 -translate-x-3 -translate-y-3 border-2 border-accent/45 desktop:-translate-x-5 desktop:-translate-y-5',
            )}
          />

          {/* El arco con la foto */}
          <div className={cn(ARCH, 'absolute inset-0 overflow-hidden shadow-high')}>
            <img
              {...main}
              alt={main.alt}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              className="size-full object-cover"
            />
            {/* Velo arriba a la derecha para la nota manuscrita */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(70%_55%_at_75%_12%,rgb(11_22_38/0.55),transparent_70%)]"
            />
            <div aria-hidden className="hero-curtain absolute inset-0 bg-surface-sunken" />
          </div>

          <PalmFrond className="hero-sway hero-delay-3 absolute -top-[2%] left-[2%] w-[24%] -rotate-[18deg] text-palma-700 drop-shadow-[0_6px_10px_rgb(11_22_38/0.25)] desktop:top-[4%] desktop:-left-[2%] desktop:w-[26%]" />

          {/* Nota manuscrita sobre la foto */}
          <p
            aria-hidden
            className="hero-pop hero-delay-4 absolute top-[16%] right-[8%] flex -rotate-12 flex-col items-end font-script text-[clamp(1.5rem,0.9rem+1.8vw,2.6rem)] leading-[0.95] text-arena-50 [text-shadow:0_2px_12px_rgb(11_22_38/0.6)] desktop:top-[17%] desktop:right-[12%]"
          >
            <span className="flex items-start gap-1">
              <Sparkle className="mt-1 size-[0.7em] -scale-x-100 text-arena-50" />
              Auténtico
            </span>
            <span>Sabor Cubano</span>
            <Swoosh className="hero-draw hero-delay-5 w-[85%] text-arena-50" />
          </p>

          {/* Polaroids que salen del marco */}
          <Polaroid
            image={mojito}
            sizes="(min-width: 1024px) 15vw, 34vw"
            caption={['El clásico', 'de la isla']}
            className="hero-delay-3 top-[40%] -left-[1%] w-[36%] -rotate-[7deg] tablet:top-[28%] tablet:w-[24%] desktop:top-[30%] desktop:-left-[9%] desktop:w-[25%]"
          />
          <Polaroid
            image={street}
            sizes="(min-width: 1024px) 12vw, 0px"
            className="hero-delay-4 hidden rotate-[6deg] tablet:top-[30%] tablet:-right-[3%] tablet:block tablet:w-[19%] desktop:top-[42%] desktop:-right-[4%] desktop:w-[20%]"
          />
        </div>
      </div>
    </section>
  )
}
