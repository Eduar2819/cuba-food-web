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
  {
    id: 'progreso',
    slug: 'progreso',
    name: 'Progreso',
    state: 'Yucatán',
    description:
      'Frente al Golfo, la cocina cubana se cruza con el pescado del día: mariscos enchilados, arroz y tostones con vista al malecón.',
    center: { lat: 21.2835, lng: -89.6622 },
    zoom: 13,
    image: IMAGES.progreso,
  },
  {
    id: 'valladolid',
    slug: 'valladolid',
    name: 'Valladolid',
    state: 'Yucatán',
    description:
      'Entre calles de colores, pequeñas cocinas familiares sirven platos cubanos a quienes van o vienen de los cenotes.',
    center: { lat: 20.6893, lng: -88.2012 },
    zoom: 14,
    image: IMAGES.valladolid,
  },
]

export const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'merida-centro', slug: 'centro', name: 'Centro', cityId: 'merida' },
  { id: 'merida-garcia-gineres', slug: 'garcia-gineres', name: 'García Ginerés', cityId: 'merida' },
  { id: 'merida-montejo', slug: 'montejo', name: 'Paseo de Montejo', cityId: 'merida' },
  { id: 'merida-norte', slug: 'norte', name: 'Norte', cityId: 'merida' },
  { id: 'progreso-malecon', slug: 'malecon', name: 'Malecón', cityId: 'progreso' },
  { id: 'progreso-chicxulub', slug: 'chicxulub', name: 'Chicxulub Puerto', cityId: 'progreso' },
  { id: 'valladolid-centro', slug: 'centro', name: 'Centro', cityId: 'valladolid' },
  { id: 'valladolid-sisal', slug: 'sisal', name: 'Barrio de Sisal', cityId: 'valladolid' },
]
