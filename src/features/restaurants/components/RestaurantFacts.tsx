import {
  Accessibility,
  Baby,
  CalendarCheck,
  Car,
  CircleCheck,
  CircleX,
  CreditCard,
  Dog,
  Music,
  Salad,
  Snowflake,
  Trees,
  Wifi,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { serviceLabel } from '../services/catalog'
import type { RestaurantFacts as Facts } from '../types'

const FACTS: Record<keyof Facts, { icon: LucideIcon; yes: string; no: string }> = {
  parking: { icon: Car, yes: 'Estacionamiento', no: 'Sin estacionamiento' },
  wifi: { icon: Wifi, yes: 'Wi-Fi', no: 'Sin Wi-Fi' },
  cardPayments: { icon: CreditCard, yes: 'Acepta tarjeta', no: 'Solo efectivo' },
  reservations: { icon: CalendarCheck, yes: 'Acepta reservaciones', no: 'Sin reservaciones' },
  petFriendly: { icon: Dog, yes: 'Admite mascotas', no: 'No admite mascotas' },
  wheelchairAccessible: {
    icon: Accessibility,
    yes: 'Acceso para silla de ruedas',
    no: 'Sin acceso para silla de ruedas',
  },
  airConditioning: { icon: Snowflake, yes: 'Aire acondicionado', no: 'Sin aire acondicionado' },
  outdoorSeating: { icon: Trees, yes: 'Mesas al aire libre', no: 'Sin mesas al aire libre' },
  liveMusic: { icon: Music, yes: 'Música en vivo', no: 'Sin música en vivo' },
  kidsMenu: { icon: Baby, yes: 'Menú infantil', no: 'Sin menú infantil' },
  vegetarianOptions: { icon: Salad, yes: 'Opciones vegetarianas', no: 'Sin opciones vegetarianas' },
}

/**
 * "Todo lo que necesitas saber". Solo se listan datos confirmados por el restaurante:
 * un dato ausente no se muestra ni se asume.
 */
export function RestaurantFacts({ facts, serviceIds }: { facts: Facts; serviceIds: string[] }) {
  const known = (Object.keys(FACTS) as (keyof Facts)[]).filter((key) => facts[key] !== undefined)
  // Primero lo que sí ofrece.
  known.sort((a, b) => Number(facts[b]) - Number(facts[a]))

  return (
    <div className="flex flex-col gap-6">
      {serviceIds.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-small font-semibold text-ink">Servicios</p>
          <ul className="flex flex-wrap gap-2">
            {serviceIds.map((id) => (
              <li
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-small text-ink"
              >
                <CircleCheck aria-hidden size={16} className="text-status-open" />
                {serviceLabel(id)}
              </li>
            ))}
          </ul>
        </div>
      )}
      {known.length > 0 && (
        <ul className="grid gap-x-6 gap-y-3 tablet:grid-cols-2">
          {known.map((key) => {
            const { icon: Icon, yes, no } = FACTS[key]
            const value = facts[key]
            return (
              <li
                key={key}
                className={cn(
                  'flex items-center gap-3 text-body',
                  value ? 'text-ink' : 'text-ink-muted',
                )}
              >
                <Icon aria-hidden size={20} className={value ? 'text-brand' : 'text-ink-muted'} />
                <span className="flex-1">{value ? yes : no}</span>
                {value ? (
                  <CircleCheck aria-hidden size={16} className="text-status-open" />
                ) : (
                  <CircleX aria-hidden size={16} />
                )}
              </li>
            )
          })}
        </ul>
      )}
      <p className="text-caption text-ink-muted">
        Solo mostramos lo que el restaurante confirmó. Si algo no aparece, pregunta antes de ir.
      </p>
    </div>
  )
}
