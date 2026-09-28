import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders'
import { favoritesStore } from '@/features/favorites'
import { routes } from './router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return router
}

describe('Platillos', () => {
  it('flujo platillo → restaurantes que lo ofrecen', async () => {
    renderAt('/platillos/ropa-vieja')
    expect(await screen.findByRole('heading', { level: 1, name: 'Ropa vieja' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Dónde comer ropa vieja' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'La Habana del Caribe' })).toHaveAttribute(
      'href',
      '/restaurantes/la-habana-del-caribe',
    )
  })
})

describe('Zonas', () => {
  it('ficha de ciudad con sus restaurantes', async () => {
    renderAt('/zonas/progreso')
    expect(await screen.findByRole('heading', { level: 1, name: 'Progreso' })).toBeInTheDocument()
    expect(screen.getByText('2 restaurantes en Progreso')).toBeInTheDocument()
  })
})

describe('Eventos', () => {
  it('evento con fecha, lugar y archivo de calendario', async () => {
    renderAt('/eventos/clase-de-salsa-casino')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Clase de salsa casino frente al mar' }),
    ).toBeInTheDocument()
    const ics = screen.getByRole('link', { name: 'Agregar a mi calendario' })
    expect(ics).toHaveAttribute('download', 'clase-de-salsa-casino.ics')
    expect(decodeURIComponent(ics.getAttribute('href') ?? '')).toContain('DTSTART:20261011T000000Z')
  })
})

describe('Blog', () => {
  it('artículo con cuerpo, platillos relacionados y JSON-LD Article', async () => {
    renderAt('/blog/ropa-vieja-historia')
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Ropa vieja: el guiso con nombre de leyenda',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cómo se prepara' })).toBeInTheDocument()
    const types = [...document.querySelectorAll('script[type="application/ld+json"]')].map(
      (s) => JSON.parse(s.textContent ?? '{}')['@type'],
    )
    expect(types).toContain('Article')
  })
})

describe('Favoritos', () => {
  it('vacío invita a explorar; con datos lista los guardados', async () => {
    renderAt('/favoritos')
    expect(await screen.findByText('Aún no guardas restaurantes.')).toBeInTheDocument()
    await favoritesStore.add('r-sabor-cuba')
    expect(await screen.findByText('1 restaurante guardado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sabor de Cuba' })).toBeInTheDocument()
    await favoritesStore.remove('r-sabor-cuba')
  })
})

describe('Para restaurantes y contacto', () => {
  it('muestra los tres planes y el contacto valida antes de enviar', async () => {
    renderAt('/para-restaurantes')
    expect(await screen.findByRole('heading', { name: 'Básico' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Destacado' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Premium' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('link', { name: 'Elegir Destacado' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument()
    expect(screen.getByText('Plan elegido: Destacado')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Escribe tu nombre.')
    expect(screen.getByLabelText('Nombre')).toHaveFocus()
  })
})
