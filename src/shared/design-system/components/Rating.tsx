import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface RatingProps {
  value: number
  max?: number
  count?: number
  size?: 'sm' | 'md'
  /** Muestra el valor numérico junto a las estrellas. */
  showValue?: boolean
  className?: string
}

const formatter = new Intl.NumberFormat('es-MX', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

/** Calificación de solo lectura, accesible como texto: "4.5 de 5 (12 reseñas)". */
export function Rating({
  value,
  max = 5,
  count,
  size = 'sm',
  showValue = true,
  className,
}: RatingProps) {
  const clamped = Math.max(0, Math.min(max, value))
  const iconSize = size === 'sm' ? 14 : 18
  const label = `${formatter.format(clamped)} de ${max}${count !== undefined ? ` (${count} reseñas)` : ''}`
  const stars = (className?: string) =>
    Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        size={iconSize}
        fill="currentColor"
        strokeWidth={0}
        className={cn('shrink-0', className)}
      />
    ))

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span role="img" aria-label={label} className="relative inline-flex">
        <span aria-hidden className="flex text-line-strong">
          {stars()}
        </span>
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 flex overflow-hidden text-mamoncillo-400"
          style={{ width: `${(clamped / max) * 100}%` }}
        >
          {stars()}
        </span>
      </span>
      {showValue && (
        <span
          aria-hidden
          className={cn('font-semibold text-ink', size === 'sm' ? 'text-caption' : 'text-small')}
        >
          {formatter.format(clamped)}
          {count !== undefined && <span className="font-normal text-ink-muted"> ({count})</span>}
        </span>
      )}
    </span>
  )
}
