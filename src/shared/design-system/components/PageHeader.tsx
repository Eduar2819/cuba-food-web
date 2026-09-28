import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface PageHeaderProps {
  title: string
  description?: ReactNode
  /** Contenido sobre el título (migas, badge). */
  before?: ReactNode
  actions?: ReactNode
  className?: string
}

/** Encabezado de página interior: título grande alineado a la izquierda, descripción debajo. */
export function PageHeader({ title, description, before, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-col gap-4 pt-8 pb-6 tablet:pt-12 tablet:pb-8', className)}>
      {before}
      <div className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between">
        <div className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold text-ink">{title}</h1>
          {description && <p className="max-w-prose text-lead text-ink-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  )
}
