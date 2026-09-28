import type { LucideIcon } from 'lucide-react'
import { Bike, Clock, Coffee, LocateFixed, ShoppingBag, UtensilsCrossed } from 'lucide-react'
import type { DirectoryFilters } from './filterParams'

export interface QuickFilter {
  id: string
  label: string
  icon: LucideIcon
  filters: Partial<DirectoryFilters>
}

/** Accesos rápidos del hero: cada uno abre el directorio ya filtrado. */
export const QUICK_FILTERS: QuickFilter[] = [
  { id: 'cerca', label: 'Cerca de mí', icon: LocateFixed, filters: { orden: 'distancia' } },
  { id: 'abierto', label: 'Abierto ahora', icon: Clock, filters: { abierto: true } },
  {
    id: 'restaurantes',
    label: 'Restaurantes',
    icon: UtensilsCrossed,
    filters: { tipos: ['restaurante'] },
  },
  { id: 'cafeterias', label: 'Cafeterías', icon: Coffee, filters: { tipos: ['cafeteria'] } },
  { id: 'delivery', label: 'Delivery', icon: Bike, filters: { servicios: ['delivery'] } },
  {
    id: 'para-llevar',
    label: 'Para llevar',
    icon: ShoppingBag,
    filters: { servicios: ['para-llevar'] },
  },
]
