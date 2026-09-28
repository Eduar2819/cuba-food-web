import { CircleCheck, Clock, CircleMinus } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { OpenStatus } from '../types'

const config = {
  open: { word: 'Abierto', icon: CircleCheck, className: 'text-status-open' },
  'closing-soon': { word: 'Cierra pronto', icon: Clock, className: 'text-status-soon' },
  closed: { word: 'Cerrado', icon: CircleMinus, className: 'text-status-closed' },
} as const

function detail(status: OpenStatus): string {
  if (status.state === 'closing-soon' && status.minutesUntilChange !== null) {
    return `en ${status.minutesUntilChange} min`
  }
  return status.label
}

/**
 * Estado con icono + palabra + detalle: nunca depende solo del color.
 * "Abierto · Cierra a las 11:00 PM" / "Cierra pronto · en 25 min" / "Cerrado · Abre mañana…"
 */
export function OpenStatusLabel({
  status,
  size = 'sm',
  className,
}: {
  status: OpenStatus
  size?: 'sm' | 'md'
  className?: string
}) {
  const { word, icon: Icon, className: tone } = config[status.state]
  return (
    <p
      className={cn(
        'flex items-start gap-1.5',
        size === 'sm' ? 'text-small' : 'text-body',
        className,
      )}
    >
      <Icon
        aria-hidden
        size={size === 'sm' ? 16 : 18}
        className={cn('mt-[0.2em] shrink-0', tone)}
      />
      <span>
        <span className={cn('font-semibold', tone)}>{word}</span>
        <span className="text-ink-muted"> · {detail(status)}</span>
      </span>
    </p>
  )
}
