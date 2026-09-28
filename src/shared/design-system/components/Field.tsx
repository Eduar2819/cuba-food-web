import type { ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface FieldProps {
  id: string
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

/** Estructura común: label arriba, control, ayuda y error debajo. */
export function Field({ id, label, hideLabel, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label
        htmlFor={id}
        className={cn('text-small font-semibold text-ink', hideLabel && 'sr-only')}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-caption text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-caption font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
