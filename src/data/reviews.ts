import type { Review } from '@/features/restaurants'

/* Reseñas DEMO: textos de ejemplo, no provienen de clientes reales. */
export const REVIEWS: Review[] = [
  {
    id: 'rv1',
    restaurantId: 'r-habana-caribe',
    author: 'Reseña de ejemplo',
    rating: 5,
    text: 'La ropa vieja llega jugosa y el congrí tiene el comino justo.',
    date: '2026-09-02',
    isDemo: true,
  },
  {
    id: 'rv2',
    restaurantId: 'r-habana-caribe',
    author: 'Reseña de ejemplo',
    rating: 4,
    text: 'Los viernes hay música y conviene reservar.',
    date: '2026-08-21',
    isDemo: true,
  },
  {
    id: 'rv3',
    restaurantId: 'r-cafe-mamoncillo',
    author: 'Reseña de ejemplo',
    rating: 5,
    text: 'El cortadito con pastelito de guayaba es la combinación perfecta.',
    date: '2026-09-15',
    isDemo: true,
  },
  {
    id: 'rv4',
    restaurantId: 'r-sabor-cuba',
    author: 'Reseña de ejemplo',
    rating: 4,
    text: 'Camarones enchilados con buena salsa y vista al mar.',
    date: '2026-09-07',
    isDemo: true,
  },
]
