import type { ImageAsset } from '@/shared/lib/images'

export type MenuItemTag = 'recomendado' | 'vegetariano' | 'picante' | 'nuevo' | 'para-compartir'

export interface MenuItem {
  id: string
  name: string
  description?: string
  /** Precio en MXN. */
  price: number
  /** Enlace al catálogo de platillos, si aplica. */
  dishId?: string
  tags?: MenuItemTag[]
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  items: MenuItem[]
}

interface MenuBase {
  /** YYYY-MM-DD */
  updatedAt: string
}

export type Menu =
  | (MenuBase & { type: 'structured'; categories: MenuCategory[]; currency: 'MXN' })
  | (MenuBase & { type: 'pdf'; url: string; label: string })
  | (MenuBase & { type: 'image'; images: ImageAsset[] })
  | (MenuBase & { type: 'url'; url: string; label: string })

export type MenuType = Menu['type']
