import { Link } from 'react-router'
import { CalendarHeart, Check, MapPinned, Megaphone, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Badge,
  buttonStyles,
  Card,
  ErrorState,
  PageHeader,
  Photo,
  Skeleton,
} from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { useAsync } from '@/shared/hooks/useAsync'
import { responsiveImage } from '@/shared/lib/images'
import { IMAGES } from '@/data/images'
import { Seo } from '@/features/seo'
import { planRepository } from '../services/planRepository'

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Search,
    title: 'Te encuentran al buscar',
    text: 'Aparece cuando alguien busca "ropa vieja", "cafetería" o su colonia.',
  },
  {
    icon: MapPinned,
    title: 'En el mapa y cerca de ti',
    text: 'Quien está a unas cuadras ve si estás abierto y cómo llegar.',
  },
  {
    icon: Megaphone,
    title: 'Promociones con vigencia',
    text: 'Publica ofertas con fechas y condiciones; se retiran solas al vencer.',
  },
  {
    icon: CalendarHeart,
    title: 'Tu agenda de eventos',
    text: 'Noches de son, clases y degustaciones en la agenda de la guía.',
  },
]

const FAQ = [
  {
    q: '¿Cuánto tarda en aparecer mi restaurante?',
    a: 'En este prototipo no hay registro real. En producción, revisaríamos los datos y publicaríamos el perfil en pocos días.',
  },
  {
    q: '¿Puedo cambiar de plan después?',
    a: 'Sí. Los planes serían mensuales y se podrían cambiar o cancelar en cualquier momento.',
  },
  {
    q: '¿Quién actualiza los horarios y el menú?',
    a: 'Tú, desde un panel de administración (próximamente). También podrás marcar festivos y cierres temporales.',
  },
]

const price = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

export function ForRestaurantsPage() {
  const plans = useAsync(() => planRepository.getPlans(), [])

  return (
    <div className="container-page pb-8">
      <Seo
        title="Para restaurantes: aparece en la guía"
        description="Registra tu restaurante cubano en Sabor Cubano en Yucatán: perfil, menú, promociones y eventos. Plan Básico gratis."
        path="/para-restaurantes"
      />
      <div className="grid items-end gap-8 desktop:grid-cols-[1.2fr_1fr]">
        <PageHeader
          title="¿Tienes un restaurante cubano?"
          description="Sabor Cubano es la guía donde la gente decide dónde comer cubano en Yucatán. Suma tu restaurante y deja que te encuentren."
          actions={
            <a href="#planes" className={buttonStyles({ size: 'lg' })}>
              Ver planes
            </a>
          }
        />
        <Photo
          {...responsiveImage(IMAGES.chefFuego, {
            ratio: '4/3',
            sizes: '(min-width: 1024px) 40vw, 100vw',
          })}
          ratio="4/3"
          priority
          frameClassName="hidden desktop:block"
        />
      </div>

      <section aria-labelledby="beneficios" className="py-14 tablet:py-20">
        <h2 id="beneficios" className="text-h2 font-bold text-ink">
          Lo que obtienes
        </h2>
        <ul className="mt-8 grid gap-x-10 gap-y-8 tablet:grid-cols-2">
          {BENEFITS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-text">
                <Icon aria-hidden size={22} />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-h3 font-semibold text-ink">{title}</h3>
                <p className="text-body text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="planes"
        aria-labelledby="planes-titulo"
        className="scroll-mt-28 py-14 tablet:py-20"
      >
        <h2 id="planes-titulo" className="text-h2 font-bold text-ink">
          Planes
        </h2>
        <p className="mt-2 max-w-prose text-body text-ink-muted">
          Precios de ejemplo. Este prototipo no procesa pagos.
        </p>
        {plans.status === 'loading' && (
          <div aria-hidden className="mt-8 grid gap-6 desktop:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        )}
        {plans.status === 'error' && (
          <ErrorState title="No pudimos cargar los planes." onRetry={plans.reload} />
        )}
        {plans.status === 'success' && (
          <ul className="mt-8 grid items-start gap-6 desktop:grid-cols-[1fr_1.15fr_1fr]">
            {plans.data.map((plan) => (
              <li key={plan.id}>
                <Card
                  variant={plan.recommended ? 'bezel' : 'outlined'}
                  padding="lg"
                  className={cn(plan.recommended && 'desktop:-mt-4')}
                  innerClassName="flex flex-col gap-6"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-h2 font-bold text-ink">{plan.name}</h3>
                      {plan.recommended && <Badge tone="accent">Recomendado</Badge>}
                    </div>
                    <p className="text-body text-ink-muted">{plan.summary}</p>
                  </div>
                  <p className="flex items-baseline gap-1">
                    <span className="font-display text-h1 font-bold text-ink">
                      {plan.priceMonthly === 0 ? 'Gratis' : price.format(plan.priceMonthly)}
                    </span>
                    {plan.priceMonthly > 0 && (
                      <span className="text-small text-ink-muted">al mes (MXN)</span>
                    )}
                  </p>
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-body text-ink">
                        <Check aria-hidden size={18} className="mt-1 shrink-0 text-status-open" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/contacto?plan=${plan.id}`}
                    className={buttonStyles({
                      variant: plan.recommended ? 'primary' : 'secondary',
                      fullWidth: true,
                    })}
                  >
                    Elegir {plan.name}
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="preguntas" className="max-w-3xl py-14">
        <h2 id="preguntas" className="text-h2 font-bold text-ink">
          Preguntas frecuentes
        </h2>
        <div className="mt-6 flex flex-col divide-y divide-line">
          {FAQ.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-body font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="text-h3 text-accent-text transition-transform duration-(--dur-normal) group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-2 text-body text-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
