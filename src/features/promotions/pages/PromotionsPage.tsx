import { TicketX } from 'lucide-react'
import { EmptyState, ErrorState, PageHeader, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { restaurantRepository } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { PromotionTicket } from '../components/PromotionTicket'
import { promotionRepository } from '../services/promotionRepository'

export function PromotionsPage() {
  const now = useNow()
  const data = useAsync(
    () => Promise.all([promotionRepository.getVisible(now), restaurantRepository.getAll()]),

    [],
  )
  const restaurants = new Map(data.data?.[1].map((r) => [r.id, r]))
  const promotions = data.data?.[0] ?? []

  return (
    <div className="container-page pb-8">
      <Seo
        title="Promociones en restaurantes cubanos"
        description="Promociones vigentes en restaurantes y cafeterías cubanas de Yucatán, con fechas y condiciones."
        path="/promociones"
      />
      <PageHeader
        title="Promociones"
        description="Solo mostramos promociones vigentes o por comenzar, con sus condiciones. Las vencidas se ocultan."
      />
      {data.status === 'loading' && (
        <div aria-hidden className="grid gap-4 desktop:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
      )}
      {data.status === 'error' && (
        <ErrorState title="No pudimos cargar las promociones." onRetry={data.reload} />
      )}
      {data.status === 'success' &&
        (promotions.length === 0 ? (
          <EmptyState
            icon={TicketX}
            title="No hay promociones vigentes por ahora."
            description="Los restaurantes publican nuevas promociones cada semana."
          />
        ) : (
          <ul className="grid gap-4 desktop:grid-cols-2 desktop:gap-6">
            {promotions.map((promotion) => {
              const r = restaurants.get(promotion.restaurantId)
              return (
                <li key={promotion.id}>
                  <PromotionTicket
                    promotion={promotion}
                    now={now}
                    restaurant={r && { name: r.name, slug: r.slug }}
                    showConditions
                  />
                </li>
              )
            })}
          </ul>
        ))}
    </div>
  )
}
