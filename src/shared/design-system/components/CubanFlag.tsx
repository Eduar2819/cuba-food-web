import { cn } from '@/shared/lib/cn'

/**
 * Bandera de Cuba 🇨🇺 como SVG: Windows no renderiza emojis de bandera (muestra "CU").
 * Colores oficiales de la bandera (no forman parte de la paleta de UI).
 */
export function CubanFlag({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="bandera de Cuba"
      viewBox="0 0 30 15"
      className={cn('inline-block h-[0.62em] w-auto rounded-[0.08em] align-[0.02em]', className)}
    >
      <rect width="30" height="15" fill="#fff" />
      <rect width="30" height="3" y="0" fill="#002A8F" />
      <rect width="30" height="3" y="6" fill="#002A8F" />
      <rect width="30" height="3" y="12" fill="#002A8F" />
      <path d="M0 0 L12.99 7.5 L0 15 Z" fill="#CF142B" />
      <polygon
        fill="#fff"
        points="4.33,5.20 4.85,6.79 6.52,6.79 5.17,7.77 5.68,9.36 4.33,8.38 2.98,9.36 3.49,7.77 2.14,6.79 3.81,6.79"
      />
    </svg>
  )
}
