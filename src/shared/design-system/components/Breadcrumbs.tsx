import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export interface Crumb {
  label: string
  /** Elemento de enlace ya construido (el DS no depende del router). Ausente = página actual. */
  link?: ReactNode
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan">
      <ol className="flex flex-wrap items-center gap-1 text-small text-ink-muted">
        {items.map((item, i) => (
          <li
            key={item.label}
            className="flex min-h-11 items-center gap-1 [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center"
          >
            {i > 0 && <ChevronRight aria-hidden size={14} />}
            {item.link ?? (
              <span aria-current="page" className="font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
