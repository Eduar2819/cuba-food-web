import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Search } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface SearchBoxProps {
  /** hero: pieza protagonista con doble bisel sobre fotografía. */
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
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        hero && 'rounded-full bg-white/14 p-1.5 ring-1 ring-white/25 backdrop-blur-none',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-2 rounded-full bg-surface pr-1.5 pl-5',
          hero ? 'min-h-15 shadow-high' : 'min-h-13 ring-1 ring-line-strong',
          'focus-within:ring-2 focus-within:ring-focus',
        )}
      >
        <Search aria-hidden size={20} className="shrink-0 text-ink-muted" />
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
            hero && 'min-h-12',
          )}
        >
          Buscar
        </button>
      </div>
    </form>
  )
}
