import { cn } from '@/shared/lib/cn'
import { TILE_PETALS } from './TileFlower'

/**
 * Marca: losa hidráulica añil con flor de cuatro pétalos en guayaba (el piso de las casas
 * habaneras) + wordmark en Fraunces. Geométrica y legible a 32px.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg aria-hidden viewBox="0 0 48 48" className="size-8 shrink-0">
        <rect width="48" height="48" rx="13" className="fill-anil-900 dark:fill-anil-200" />
        <path d={TILE_PETALS} className="fill-guayaba-500" />
        <circle cx="24" cy="24" r="3.2" className="fill-mamoncillo-400" />
      </svg>
      {!compact && (
        <span className="font-display text-[1.125rem] leading-none font-semibold tracking-[-0.01em] whitespace-nowrap text-ink min-[360px]:text-[1.25rem]">
          Sabor Cubano
          <span className="sr-only"> en Mérida</span>
        </span>
      )}
    </span>
  )
}
