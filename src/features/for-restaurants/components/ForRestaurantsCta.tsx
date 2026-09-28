import { Link } from 'react-router'
import { buttonStyles } from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import { IMAGES } from '@/data/images'

/** Banda final para dueños de restaurantes: fotografía a sangre dentro del marco redondeado. */
export function ForRestaurantsCta() {
  const image = responsiveImage(IMAGES.habanaArco, { ratio: '21/9', sizes: '100vw' })
  return (
    <section
      aria-labelledby="cta-restaurantes"
      className="px-3 pt-14 tablet:px-4 tablet:pt-20 desktop:px-6"
    >
      <div className="relative isolate mx-auto flex min-h-[26rem] max-w-(--container-page) overflow-hidden rounded-xl bg-anil-975">
        <img
          {...image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-t from-anil-975/90 via-anil-975/60 to-anil-975/20 desktop:bg-linear-to-r desktop:via-anil-975/55 desktop:to-transparent"
        />
        <div className="mt-auto flex max-w-xl flex-col gap-5 p-6 tablet:p-10 desktop:my-auto desktop:p-14">
          <h2 id="cta-restaurantes" className="text-h1 font-bold text-arena-50">
            ¿Tienes un restaurante cubano?
          </h2>
          <p className="text-lead text-arena-100">
            Aparece en la guía, publica tu menú, tus promociones y tus eventos. El plan Básico es
            gratis.
          </p>
          <div>
            <Link
              to="/para-restaurantes"
              className={buttonStyles({ variant: 'overlay', size: 'lg' })}
            >
              Registra tu restaurante
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
