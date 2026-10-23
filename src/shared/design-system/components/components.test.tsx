import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Heart } from 'lucide-react'
import { Button } from './Button'
import { Chip } from './Chip'
import { Dialog } from './Dialog'
import { IconButton } from './IconButton'
import { Input } from './Input'
import { Tabs } from './Tabs'
import { ToastProvider } from './ToastProvider'
import { useToast } from './toastContext'

describe('Button', () => {
  it('es type="button" por defecto y dispara onClick', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Guardar</Button>)
    const button = screen.getByRole('button', { name: 'Guardar' })
    expect(button).toHaveAttribute('type', 'button')
    await userEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('en loading queda deshabilitado y aria-busy', () => {
    render(<Button loading>Guardando</Button>)
    const button = screen.getByRole('button', { name: 'Guardando' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
  })
})

describe('IconButton', () => {
  it('expone su label como nombre accesible', () => {
    render(<IconButton icon={Heart} label="Guardar en favoritos" />)
    expect(screen.getByRole('button', { name: 'Guardar en favoritos' })).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('refleja el estado con aria-pressed', async () => {
    function Toggle() {
      const [on, setOn] = useState(false)
      return (
        <Chip selected={on} onClick={() => setOn(!on)}>
          Abierto ahora
        </Chip>
      )
    }
    render(<Toggle />)
    const chip = screen.getByRole('button', { name: 'Abierto ahora' })
    expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    expect(chip).toHaveAttribute('aria-pressed', 'true')
  })
})

describe('Input', () => {
  it('asocia label y mensaje de error', () => {
    render(<Input label="Teléfono" error="Escribe 10 dígitos." />)
    const input = screen.getByLabelText('Teléfono')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Escribe 10 dígitos.')
  })
})

describe('Tabs', () => {
  const items = [
    { id: 'menu', label: 'Menú', content: <p>Contenido menú</p> },
    { id: 'horarios', label: 'Horarios', content: <p>Contenido horarios</p> },
    { id: 'fotos', label: 'Fotos', content: <p>Contenido fotos</p> },
  ]

  it('muestra el panel de la pestaña activa', async () => {
    render(<Tabs label="Secciones" items={items} />)
    expect(screen.getByText('Contenido menú')).toBeVisible()
    await userEvent.click(screen.getByRole('tab', { name: 'Horarios' }))
    expect(screen.getByRole('tab', { name: 'Horarios' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('Contenido horarios')).toBeVisible()
  })

  it('navega con flechas, Home y End', async () => {
    render(<Tabs label="Secciones" items={items} />)
    const first = screen.getByRole('tab', { name: 'Menú' })
    first.focus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Horarios' })).toHaveFocus()
    await userEvent.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Fotos' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Menú' })).toHaveFocus()
    await userEvent.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Menú' })).toHaveAttribute('aria-selected', 'true')
  })
})

describe('Dialog', () => {
  it('abre con título accesible y cierra con el botón', async () => {
    function Harness() {
      const [open, setOpen] = useState(false)
      return (
        <>
          <Button onClick={() => setOpen(true)}>Abrir</Button>
          <Dialog open={open} onClose={() => setOpen(false)} title="Compartir">
            <p>Opciones</p>
          </Dialog>
        </>
      )
    }
    render(<Harness />)
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }))
    const dialog = screen.getByRole('dialog', { name: 'Compartir' })
    expect(dialog).toHaveAttribute('open')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }))
    expect(dialog).not.toHaveAttribute('open')
  })
})

describe('Toast', () => {
  it('anuncia el mensaje en una región viva', async () => {
    function Trigger() {
      const toast = useToast()
      return <Button onClick={() => toast.show('Enlace copiado')}>Copiar</Button>
    }
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Copiar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Enlace copiado')
  })
})
