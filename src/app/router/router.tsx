import { createBrowserRouter } from 'react-router'
import type { RouteObject } from 'react-router'
import type { ComponentType } from 'react'
import { RootLayout } from '@/app/layouts/RootLayout'
import { NotFoundPage } from '@/app/routes/NotFoundPage'
import { RouteErrorPage } from '@/app/routes/RouteErrorPage'

/*
 * Cada ruta se carga bajo demanda (code splitting por ruta).
 * Las páginas de features se importan directamente para que cada una sea su propio chunk;
 * ESLint permite esta excepción solo en app/router.
 */

const page = <T extends Record<string, ComponentType>>(
  loader: () => Promise<T>,
  name: keyof T,
): RouteObject['lazy'] => {
  return async () => ({ Component: (await loader())[name] })
}

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'design-system',
        lazy: page(() => import('@/app/dev/DesignSystemPage'), 'DesignSystemPage'),
      },
    ]
  : []

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    errorElement: <RouteErrorPage />,
    HydrateFallback: () => null,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, lazy: page(() => import('@/app/routes/HomePage'), 'HomePage') },
          {
            path: 'restaurantes',
            lazy: page(() => import('@/features/restaurants/pages/DirectoryPage'), 'DirectoryPage'),
          },
          {
            path: 'restaurantes/:slug',
            lazy: page(
              () => import('@/features/restaurants/pages/RestaurantPage'),
              'RestaurantPage',
            ),
          },
          { path: 'mapa', lazy: page(() => import('@/features/map/pages/MapPage'), 'MapPage') },
          {
            path: 'platillos',
            lazy: page(() => import('@/features/dishes/pages/DishesPage'), 'DishesPage'),
          },
          {
            path: 'platillos/:slug',
            lazy: page(() => import('@/features/dishes/pages/DishPage'), 'DishPage'),
          },
          {
            path: 'eventos',
            lazy: page(() => import('@/features/events/pages/EventsPage'), 'EventsPage'),
          },
          {
            path: 'eventos/:slug',
            lazy: page(() => import('@/features/events/pages/EventPage'), 'EventPage'),
          },
          {
            path: 'promociones',
            lazy: page(
              () => import('@/features/promotions/pages/PromotionsPage'),
              'PromotionsPage',
            ),
          },
          {
            path: 'zonas',
            lazy: page(() => import('@/features/zones/pages/ZonesPage'), 'ZonesPage'),
          },
          {
            path: 'zonas/:slug',
            lazy: page(() => import('@/features/zones/pages/ZonePage'), 'ZonePage'),
          },
          { path: 'blog', lazy: page(() => import('@/features/blog/pages/BlogPage'), 'BlogPage') },
          {
            path: 'blog/:slug',
            lazy: page(() => import('@/features/blog/pages/BlogPostPage'), 'BlogPostPage'),
          },
          {
            path: 'favoritos',
            lazy: page(() => import('@/features/favorites/pages/FavoritesPage'), 'FavoritesPage'),
          },
          {
            path: 'para-restaurantes',
            lazy: page(
              () => import('@/features/for-restaurants/pages/ForRestaurantsPage'),
              'ForRestaurantsPage',
            ),
          },
          { path: 'contacto', lazy: page(() => import('@/app/routes/ContactPage'), 'ContactPage') },
          { path: 'creditos', lazy: page(() => import('@/app/routes/CreditsPage'), 'CreditsPage') },
          ...devRoutes,
          // La 404 ya viaja en el bundle principal (la usa el errorElement).
          { path: '*', Component: NotFoundPage },
        ],
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
