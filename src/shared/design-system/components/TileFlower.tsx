import { cn } from '@/shared/lib/cn'

/** Pétalos de la losa hidráulica (mismo dibujo que la marca). */
export const TILE_PETALS =
  'M24 7c3.4 5.6 3.4 11.4 0 17-3.4-5.6-3.4-11.4 0-17zM24 41c-3.4-5.6-3.4-11.4 0-17 3.4 5.6 3.4 11.4 0 17zM7 24c5.6-3.4 11.4-3.4 17 0-5.6 3.4-11.4 3.4-17 0zM41 24c-5.6 3.4-11.4 3.4-17 0 5.6-3.4 11.4-3.4 17 0z'

/** Flor de losa hidráulica: ornamento decorativo que hereda el color del texto. */
export function TileFlower({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className={cn('size-4 shrink-0', className)}>
      <path d={TILE_PETALS} fill="currentColor" />
      <path d="M24 2 46 24 24 46 2 24z" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  )
}
