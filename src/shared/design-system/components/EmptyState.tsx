import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
  tone?: 'neutral' | 'danger'
  role?: 'status' | 'alert'
  /** Nivel semántico del título (p. ej. h1 en páginas de "no encontrado"). */
  headingLevel?: 'h1' | 'h2' | 'h3' | 'p'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  tone = 'neutral',
  role = 'status',
  headingLevel: Title = 'p',
}: EmptyStateProps) {
  return (
    <div
      role={role}
      className={cn(
        'flex flex-col items-start gap-4 rounded-lg bg-surface-sunken p-6 tablet:p-8',
        className,
      )}
    >
      <span
        className={cn(
          'flex size-12 items-center justify-center rounded-full',
          tone === 'danger' ? 'bg-danger-soft text-danger' : 'bg-surface text-brand',
        )}
      >
        <Icon aria-hidden size={24} />
      </span>
      <div className="flex max-w-prose flex-col gap-1">
        <Title className="font-display text-h3 font-semibold text-ink">{title}</Title>
        {description && <p className="text-small text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
