import type { LucideIcon } from 'lucide-react'
import { Heart, House, Map, Search } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
}

/** Navegación principal (desktop). */
export const PRIMARY_NAV: NavItem[] = [
  { to: '/restaurantes', label: 'Restaurantes' },
  { to: '/mapa', label: 'Mapa' },
  { to: '/platillos', label: 'Platillos' },
  { to: '/eventos', label: 'Eventos' },
]

/** Menú móvil completo y pie de página. */
export const SECTION_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Explora',
    items: [
      { to: '/restaurantes', label: 'Restaurantes' },
      { to: '/mapa', label: 'Mapa' },
      { to: '/platillos', label: 'Platillos' },
      { to: '/zonas', label: 'Zonas' },
    ],
  },
  {
    title: 'Descubre',
    items: [
      { to: '/eventos', label: 'Eventos' },
      { to: '/promociones', label: 'Promociones' },
      { to: '/blog', label: 'Blog' },
      { to: '/favoritos', label: 'Favoritos' },
    ],
  },
  {
    title: 'Para negocios',
    items: [
      { to: '/para-restaurantes', label: 'Para restaurantes' },
      { to: '/contacto', label: 'Contacto' },
    ],
  },
]

export interface TabItem {
  label: string
  icon: LucideIcon
  to?: string
  action?: 'search'
}

/** Barra inferior móvil. */
export const MOBILE_TABS: TabItem[] = [
  { label: 'Inicio', icon: House, to: '/' },
  { label: 'Buscar', icon: Search, action: 'search' },
  { label: 'Mapa', icon: Map, to: '/mapa' },
  { label: 'Favoritos', icon: Heart, to: '/favoritos' },
]
