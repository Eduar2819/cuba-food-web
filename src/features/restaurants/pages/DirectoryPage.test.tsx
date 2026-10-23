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
  return router
}

describe('Directorio', () => {
  it('lee los filtros de la URL y muestra el contador', async () => {
    renderAt('/restaurantes?tipo=cafeteria')
    expect(await screen.findByText('1 restaurante')).toBeInTheDocument()
    const list = screen.getAllByRole('list').find((l) => within(l).queryAllByRole('article').length)
    expect(within(list!).getAllByRole('article')).toHaveLength(1)
    expect(screen.getByRole('button', { name: 'Quitar filtro: Cafetería' })).toBeInTheDocument()
  })

  it('filtra por búsqueda con acentos indistintos', async () => {
    renderAt('/restaurantes?q=merida')
    expect(await screen.findByText('4 restaurantes para "merida"')).toBeInTheDocument()
  })

  it('muestra el estado vacío y permite limpiar filtros', async () => {
    const router = renderAt('/restaurantes?zona=centro&tipo=cafeteria')
    expect(
      await screen.findByText('No encontramos restaurantes con estos filtros.'),
    ).toBeInTheDocument()
    await userEvent.click(screen.getAllByRole('button', { name: 'Limpiar filtros' })[0]!)
    expect(await screen.findByText('4 restaurantes')).toBeInTheDocument()
    expect(router.state.location.search).toBe('')
  })

  it('cambiar el orden actualiza la URL', async () => {
    const router = renderAt('/restaurantes')
    await screen.findByText('4 restaurantes')
    await userEvent.selectOptions(screen.getByLabelText('Ordenar por'), 'populares')
    expect(router.state.location.search).toBe('?orden=populares')
  })
})

describe('Búsqueda global', () => {
  it('muestra resultados agrupados y navega con el teclado', async () => {
    const router = renderAt('/restaurantes')
    await screen.findByText('4 restaurantes')
    await userEvent.keyboard('/')
    const input = await screen.findByRole(
      'combobox',
      { name: /Buscar restaurantes, platillos/ },
      { timeout: 5000 },
    )
    await userEvent.type(input, 'ropa vieja')
    expect(
      await screen.findByRole('option', { name: /Ropa vieja/ }, { timeout: 5000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Restaurantes' })).toBeInTheDocument()
    await userEvent.keyboard('{Enter}')
    expect(router.state.location.pathname).toBe('/platillos/ropa-vieja')
  })
})
