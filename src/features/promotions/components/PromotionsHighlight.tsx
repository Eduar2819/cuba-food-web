import { Link } from 'react-router'
import { ErrorState, Section, Skeleton, textLinkClass } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { restaurantRepository } from '@/features/restaurants'
import { promotionRepository } from '../services/promotionRepository'
import { PromotionTicket } from './PromotionTicket'

export function PromotionsHighlight({ now }: { now: Date }) {
  const data = useAsync(
    () => Promise.all([promotionRepository.getVisible(now), restaurantRepository.getAll()]),

    [],
  )
  const restaurants = new Map(data.data?.[1].map((r) => [r.id, r]))
  const promotions = data.data?.[0].slice(0, 4) ?? []

  if (data.status === 'success' && promotions.length === 0) return null

  return (
    <Section
      title="Promociones vigentes"
      action={
        <Link to="/promociones" className={textLinkClass}>
          Ver todas las promociones
        </Link>
      }
    >
      {data.status === 'loading' && (
        <div aria-hidden className="grid gap-4 desktop:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      )}
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar las promociones." onRetry={data.reload} />
      )}
      {data.status === 'success' && (
        <div className="grid gap-4 desktop:grid-cols-2 desktop:gap-6">
          {promotions.map((promotion) => {
            const restaurant = restaurants.get(promotion.restaurantId)
            return (
              <PromotionTicket
                key={promotion.id}
                promotion={promotion}
                now={now}
                restaurant={restaurant && { name: restaurant.name, slug: restaurant.slug }}
              />
            )
          })}
        </div>
      )}
    </Section>
  )
}
