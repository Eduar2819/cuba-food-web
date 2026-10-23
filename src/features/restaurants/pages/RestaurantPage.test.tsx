import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { AppProviders } from '@/app/providers/AppProviders'
import { routes } from '@/app/router/router'

function renderAt(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>,
  )
}

describe('Perfil del restaurante', () => {
  it('muestra datos, acciones de contacto, horarios, menú y JSON-LD', async () => {
    renderAt('/restaurantes/la-habana-del-caribe')
    expect(
      await screen.findByRole('heading', { level: 1, name: 'La Habana del Caribe' }),
    ).toBeInTheDocument()

    const actions = screen.getAllByRole('link', { name: /Cómo llegar/ })[0]!
    expect(actions).toHaveAttribute(
      'href',
      expect.stringContaining('google.com/maps/dir/?api=1&destination=20.9689,-89.6221'),
    )
    expect(screen.getAllByRole('link', { name: /WhatsApp/ })[0]).toHaveAttribute(
      'href',
      expect.stringMatching(/^https:\/\/wa\.me\/529990000101\?text=/),
    )
    expect(screen.getAllByRole('link', { name: /Llamar/ })[0]).toHaveAttribute(
      'href',
      'tel:+529990000101',
    )

    // Horario con el día actual marcado.
    const table = screen.getByRole('table')
    expect(within(table).getByText('Hoy')).toBeInTheDocument()

    // Menú estructurado por pestañas.
    await userEvent.click(screen.getByRole('tab', { name: 'Platos fuertes' }))
    expect(within(screen.getByRole('tabpanel')).getByText('Ropa vieja')).toBeInTheDocument()

    // Platillos de la casa enlazan a su ficha cultural.
    const dishes = screen.getByRole('region', { name: 'Platillos de la casa' })
    expect(within(dishes).getByRole('link', { name: /Ropa vieja/ })).toHaveAttribute(
      'href',
      '/platillos/ropa-vieja',
    )

    // "Todo lo que necesitas saber" solo muestra datos confirmados.
    expect(screen.getByText('Sin estacionamiento')).toBeInTheDocument()
    expect(screen.queryByText(/mascotas/)).not.toBeInTheDocument()

    const jsonLd = document.querySelector('script[type="application/ld+json"]')
    expect(JSON.parse(jsonLd?.textContent ?? '{}')).toMatchObject({
      '@type': 'Restaurant',
      name: 'La Habana del Caribe',
    })
  })

  it('guardar en favoritos alterna el estado', async () => {
    renderAt('/restaurantes/habana-1959')
    await screen.findByRole('heading', { level: 1, name: 'Habana 1959' })
    const save = screen.getAllByRole('button', { name: 'Guardar', pressed: false })[0]!
    await userEvent.click(save)
    expect(screen.getAllByRole('button', { pressed: true }).length).toBeGreaterThan(0)
    expect(await screen.findByText('Habana 1959: guardado en favoritos')).toBeInTheDocument()
  })

  it('slug inexistente muestra estado de no encontrado', async () => {
    renderAt('/restaurantes/no-existe')
    expect(await screen.findByText('No encontramos este restaurante.')).toBeInTheDocument()
  })
})
