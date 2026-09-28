import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { Dialog, Input } from '@/shared/design-system'

export function SearchDialog({
  initialQuery,
  onClose,
}: {
  initialQuery: string
  onClose: () => void
}) {
  const [query, setQuery] = useState(initialQuery)
  const navigate = useNavigate()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    onClose()
    navigate(q ? `/restaurantes?q=${encodeURIComponent(q)}` : '/restaurantes')
  }

  return (
    <Dialog open onClose={onClose} title="Buscar" hideTitle placement="center">
      <form role="search" onSubmit={submit}>
        <Input
          label="Buscar restaurantes, platillos o zonas"
          hideLabel
          leadingIcon={Search}
          placeholder="Ropa vieja, Mérida, cafetería…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          type="search"
          enterKeyHint="search"
        />
      </form>
    </Dialog>
  )
}
