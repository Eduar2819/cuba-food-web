import { useMemo } from 'react'
import { Link } from 'react-router'
import { Heart } from 'lucide-react'
import { buttonStyles, EmptyState, ErrorState, PageHeader, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { useNow } from '@/shared/hooks/useNow'
import { restaurantRepository, RestaurantCard } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { useFavorites } from '../hooks/useFavorites'

export function FavoritesPage() {
  const now = useNow()
  const { favorites } = useFavorites()
  const all = useAsync(() => restaurantRepository.getAll(), [])

  // Orden: el más reciente primero (como se guardaron).
  const saved = useMemo(() => {
    const byId = new Map(all.data?.map((r) => [r.id, r]))
    return favorites.map((f) => byId.get(f.restaurantId)).filter((r) => r !== undefined)
  }, [favorites, all.data])

  return (
    <div className="container-page pb-8">
      <Seo
        title="Tus favoritos"
        description="Los restaurantes cubanos que guardaste."
        path="/favoritos"
        noIndex
      />
      <PageHeader
        title="Tus favoritos"
        description="Se guardan en este dispositivo. Cuando haya cuentas de usuario, podrás verlos en cualquier lugar."
      />
      {all.status === 'loading' && favorites.length > 0 && (
        <div aria-hidden className="grid gap-8 tablet:grid-cols-2 desktop:grid-cols-3">
          {favorites.map((f) => (
            <Skeleton key={f.restaurantId} className="aspect-[4/3] rounded-lg" />
          ))}
        </div>
      )}
      {all.status === 'error' && (
        <ErrorState title="No pudimos cargar tus favoritos." onRetry={all.reload} />
      )}
      {(all.status === 'success' || favorites.length === 0) && saved.length === 0 && (
        <EmptyState
          icon={Heart}
          title="Aún no guardas restaurantes."
          description="Toca el corazón en cualquier restaurante para tenerlo a la mano."
          action={
            <Link to="/restaurantes" className={buttonStyles({ variant: 'primary' })}>
              Explorar restaurantes
            </Link>
          }
        />
      )}
      {saved.length > 0 && (
        <>
          <p aria-live="polite" className="pb-6 text-body font-semibold text-ink">
            {saved.length === 1
              ? '1 restaurante guardado'
              : `${saved.length} restaurantes guardados`}
          </p>
          <ul className="grid gap-x-6 gap-y-12 tablet:grid-cols-2 desktop:grid-cols-3">
            {saved.map((restaurant) => (
              <li key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} now={now} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
