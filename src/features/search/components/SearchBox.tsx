import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { ArrowRight, Search } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface SearchBoxProps {
  /** hero: pieza protagonista con doble bisel sobre el fondo cálido. */
  variant?: 'hero' | 'default'
  initialQuery?: string
  placeholder?: string
  className?: string
}

/** Buscador que lleva al directorio con ?q=. */
export function SearchBox({
  variant = 'default',
  initialQuery = '',
  placeholder = 'Restaurante, platillo o colonia',
  className,
}: SearchBoxProps) {
  const [query, setQuery] = useState(initialQuery)
  const navigate = useNavigate()
  const inputId = useId()
  const hero = variant === 'hero'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const q = query.trim()
    navigate(q ? `/restaurantes?q=${encodeURIComponent(q)}` : '/restaurantes')
  }

  return (
    <form role="search" onSubmit={submit} className={className}>
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-full bg-surface pr-1.5 pl-3.5 min-[360px]:gap-2 min-[360px]:pl-4 min-[400px]:pl-5',
          hero ? 'min-h-16 pr-2 shadow-high ring-1 ring-line' : 'min-h-13 ring-1 ring-line-strong',
          'focus-within:ring-2 focus-within:ring-focus',
        )}
      >
        <Search
          aria-hidden
          size={20}
          className={cn('shrink-0 text-ink-muted', hero && 'hidden min-[360px]:block')}
        />
        <label htmlFor={inputId} className="sr-only">
          Buscar restaurantes, platillos o colonias
        </label>
        <input
          id={inputId}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-3 text-body text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <button
          type="submit"
          className={cn(
            'inline-flex min-h-11 shrink-0 items-center rounded-full bg-accent px-5 text-small font-semibold text-on-accent',
            'transition-[background-color,transform] duration-(--dur-micro) ease-out-soft hover:bg-accent-hover active:scale-[0.98]',
            hero && 'min-h-12 gap-2 px-3.5 min-[360px]:px-4 min-[400px]:px-6',
          )}
        >
          Buscar
          {hero && <ArrowRight aria-hidden size={18} className="hidden min-[400px]:block" />}
        </button>
      </div>
    </form>
  )
}
