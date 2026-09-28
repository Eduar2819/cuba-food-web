import type { Plan } from '@/features/for-restaurants'

/* Planes de ejemplo: solo interfaz, sin cobros reales. */
export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    priceMonthly: 0,
    summary: 'Tu restaurante en el directorio, con lo esencial.',
    features: [
      'Perfil con dirección, horario y contacto',
      'Aparece en búsqueda y mapa',
      'Hasta 5 fotos',
      'Menú en PDF o enlace',
    ],
    recommended: false,
  },
  {
    id: 'destacado',
    name: 'Destacado',
    priceMonthly: 490,
    summary: 'Más visibilidad en las secciones que más se visitan.',
    features: [
      'Todo lo del plan Básico',
      'Aparece en Destacados de la portada',
      'Menú estructurado con precios',
      'Hasta 30 fotos',
      '2 promociones activas al mes',
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    priceMonthly: 990,
    summary: 'Para restaurantes con eventos y varias sucursales.',
    features: [
      'Todo lo del plan Destacado',
      'Eventos ilimitados',
      'Varias sucursales en un perfil',
      'Estadísticas de visitas y clics',
      'Soporte prioritario',
    ],
    recommended: false,
  },
]
