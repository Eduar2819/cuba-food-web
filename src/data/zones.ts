import type { City, Neighborhood } from '@/features/zones'
import { IMAGES } from './images'

export const CITIES: City[] = [
  {
    id: 'merida',
    slug: 'merida',
    name: 'Mérida',
    state: 'Yucatán',
    description:
      'La capital concentra la mayor oferta cubana del estado: fondas del Centro, cafeterías en el norte y cocina de autor en García Ginerés.',
    center: { lat: 20.9754, lng: -89.6169 },
    zoom: 12,
    image: IMAGES.merida,
  },
]

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'merida-centro', slug: 'centro', name: 'Centro', cityId: 'merida' },
  { id: 'merida-garcia-gineres', slug: 'garcia-gineres', name: 'García Ginerés', cityId: 'merida' },
  { id: 'merida-montejo', slug: 'montejo', name: 'Paseo de Montejo', cityId: 'merida' },
  { id: 'merida-norte', slug: 'norte', name: 'Norte', cityId: 'merida' },
]
