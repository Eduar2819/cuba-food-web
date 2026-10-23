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

describe('Eventos', () => {
  // Fecha fija: el evento debe seguir siendo futuro para mostrar el calendario.
  beforeEach(() =>
    vi.useFakeTimers({ now: new Date('2026-09-28T12:00:00-06:00'), toFake: ['Date'] }),
  )
  afterEach(() => vi.useRealTimers())

  it('evento con fecha, lugar y archivo de calendario', async () => {
    renderAt('/eventos/clase-de-salsa-casino')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Clase de salsa casino' }),
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
    await favoritesStore.add('r-tostones-co')
    expect(await screen.findByText('1 restaurante guardado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Tostones & Co.' })).toBeInTheDocument()
    await favoritesStore.remove('r-tostones-co')
  })
})

describe('Contacto', () => {
  it('valida antes de enviar', async () => {
    renderAt('/contacto')
    expect(await screen.findByRole('heading', { level: 1, name: 'Contacto' })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    expect(screen.getByLabelText('Nombre')).toHaveAccessibleDescription('Escribe tu nombre.')
    expect(screen.getByLabelText('Nombre')).toHaveFocus()
  })
})
