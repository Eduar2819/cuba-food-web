import { Link } from 'react-router'
import { CalendarDays } from 'lucide-react'
import { Badge, Photo } from '@/shared/design-system'
import { getZonedParts } from '@/shared/lib/dates'
import { responsiveImage } from '@/shared/lib/images'
import { getPromotionStatus } from '../services/promotionRepository'
import { promotionDays, promotionValidity } from '../services/promotionFormat'
import type { Promotion } from '../types'

interface PromotionTicketProps {
  promotion: Promotion
  now: Date
  restaurant?: { name: string; slug: string }
  showConditions?: boolean
  headingLevel?: 'h2' | 'h3'
}

/** Promoción en formato "ticket": foto cuadrada + datos de vigencia. */
export function PromotionTicket({
  promotion,
  now,
  restaurant,
  showConditions = false,
  headingLevel: Heading = 'h3',
}: PromotionTicketProps) {
  const status = getPromotionStatus(promotion, getZonedParts(now).isoDate)
  const days = promotionDays(promotion)
  return (
    <article className="group relative grid grid-cols-[7rem_1fr] gap-4 rounded-lg bg-surface p-3 ring-1 ring-line tablet:grid-cols-[10rem_1fr] tablet:gap-5">
      <Photo
        {...responsiveImage(promotion.image, { ratio: '1/1', sizes: '10rem', widths: [256, 384] })}
        ratio="1/1"
        zoomOnHover
      />
      <div className="flex min-w-0 flex-col gap-2 py-1 pr-1">
        <div className="flex flex-wrap items-center gap-2">
          {status === 'upcoming' ? (
            <Badge tone="brand">Próximamente</Badge>
          ) : (
            <Badge tone="accent">Vigente</Badge>
          )}
          {days && <span className="text-caption font-semibold text-ink-muted">{days}</span>}
        </div>
        <Heading className="text-h3 font-semibold text-ink">
          {restaurant ? (
            <Link
              to={`/restaurantes/${restaurant.slug}`}
              className="after:absolute after:inset-0 after:rounded-lg after:content-['']"
            >
              {promotion.title}
            </Link>
          ) : (
            promotion.title
          )}
        </Heading>
        <p className="text-small text-ink-muted">{promotion.description}</p>
        {showConditions && promotion.conditions.length > 0 && (
          <ul className="list-disc pl-4 text-caption text-ink-muted">
            {promotion.conditions.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        )}
        <p className="mt-auto flex items-center gap-1.5 text-caption text-ink-muted">
          <CalendarDays aria-hidden size={14} />
          {promotionValidity(promotion, status)}
          {restaurant && <span className="font-semibold text-ink"> · {restaurant.name}</span>}
        </p>
      </div>
    </article>
  )
}
