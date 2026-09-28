import { createBrowserRouter } from 'react-router'
import type { RouteObject } from 'react-router'

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: 'design-system',
        lazy: async () => ({
          Component: (await import('@/app/dev/DesignSystemPage')).DesignSystemPage,
        }),
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/app/dev/Placeholder')).Placeholder }),
      },
      ...devRoutes,
    ],
  },
])
