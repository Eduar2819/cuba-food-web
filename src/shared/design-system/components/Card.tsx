import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export type CardVariant = 'plain' | 'outlined' | 'raised' | 'sunken' | 'bezel'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Clases del contenido (núcleo interior en bezel; el propio contenedor en las demás). */
  innerClassName?: string
}

const paddings = { none: '', sm: 'p-4', md: 'p-5 tablet:p-6', lg: 'p-6 tablet:p-8' }

const variants: Record<Exclude<CardVariant, 'bezel'>, string> = {
  plain: 'bg-surface',
  outlined: 'bg-surface ring-1 ring-line ring-inset',
  raised: 'bg-surface-raised shadow-medium',
  sunken: 'bg-surface-sunken',
}

/**
 * Contenedor. `bezel` = doble bisel (soft-skill): carcasa exterior + núcleo con radio concéntrico.
 * Reservado a piezas protagonistas (buscador del hero, destacados, mini card del mapa).
 */
export function Card({
  variant = 'plain',
  padding = 'md',
  className,
  innerClassName,
  children,
  ...rest
}: CardProps) {
  if (variant === 'bezel') {
    return (
      <div
        className={cn(
          'rounded-xl bg-anil-900/6 p-1.5 ring-1 ring-anil-900/8 dark:bg-white/6 dark:ring-white/10',
          className,
        )}
        {...rest}
      >
        <div
          className={cn(
            'rounded-[calc(var(--radius-xl)-0.375rem)] bg-surface-raised shadow-bezel',
            paddings[padding],
            innerClassName,
          )}
        >
          {children}
        </div>
      </div>
    )
  }
  return (
    <div
      className={cn('rounded-lg', variants[variant], paddings[padding], innerClassName, className)}
      {...rest}
    >
      {children}
    </div>
  )
}
