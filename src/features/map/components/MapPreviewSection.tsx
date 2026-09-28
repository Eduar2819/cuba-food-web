import { Link } from 'react-router'
import { buttonStyles, ErrorState, Section } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { restaurantRepository } from '@/features/restaurants'
import { RestaurantsMap } from './RestaurantsMap'

/** Landing: mapa a lo ancho con todos los restaurantes (Leaflet se carga al acercarse). */
export function MapPreviewSection({ now }: { now: Date }) {
  const data = useAsync(() => restaurantRepository.getAll(), [])
  return (
    <Section
      title="Todos en el mapa"
      description="Toca un punto para ver si está abierto y cómo llegar."
      action={
        <Link to="/mapa" className={buttonStyles({ variant: 'secondary' })}>
          Abrir mapa
        </Link>
      }
    >
      {data.status === 'error' ? (
        <ErrorState title="No pudimos cargar el mapa." onRetry={data.reload} />
      ) : (
        <RestaurantsMap
          restaurants={data.data ?? []}
          now={now}
          lazyMount
          className="h-[26rem] tablet:h-[32rem]"
        />
      )}
    </Section>
  )
}
