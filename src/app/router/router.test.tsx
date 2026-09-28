import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('router', () => {
  it('renderiza el layout con navegación y la página de la ruta', async () => {
    renderAt('/restaurantes')
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegación inferior' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Saltar al contenido' })).toHaveAttribute(
      'href',
      '#contenido',
    )
  })

  it('muestra 404 en rutas desconocidas', async () => {
    renderAt('/no-existe')
    expect(await screen.findByText('No encontramos esta página.')).toBeInTheDocument()
  })

  it.each([
    '/',
    '/mapa',
    '/platillos',
    '/eventos',
    '/promociones',
    '/zonas',
    '/blog',
    '/favoritos',
    '/para-restaurantes',
    '/contacto',
  ])('la ruta %s carga', async (path) => {
    renderAt(path)
    expect(await screen.findByRole('heading', { level: 1 })).toBeInTheDocument()
  })
})
