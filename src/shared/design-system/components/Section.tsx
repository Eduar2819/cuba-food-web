import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface SectionProps {
  title: string
  /** Una línea bajo el título (máx. ~25 palabras). */
  description?: string
  /** Acción de navegación alineada al título ("Ver todos"). */
  action?: ReactNode
  children: ReactNode
  className?: string
  /** Fondo de banda (misma familia tonal; no invierte el tema). */
  tone?: 'canvas' | 'sunken'
  headingLevel?: 'h2' | 'h3'
}

/** Sección de página: título, descripción opcional, acción y contenido. */
export function Section({
  title,
  description,
  action,
  children,
  className,
  tone = 'canvas',
  headingLevel: Heading = 'h2',
}: SectionProps) {
  const id = useId()
  return (
    <section
      aria-labelledby={id}
      className={cn('py-14 tablet:py-20', tone === 'sunken' && 'bg-surface-sunken', className)}
    >
      <div className="container-page flex flex-col gap-8 tablet:gap-10">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex max-w-prose flex-col gap-2">
            <Heading id={id} className="text-h2 font-bold text-ink">
              {title}
            </Heading>
            {description && <p className="text-body text-ink-muted">{description}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}
