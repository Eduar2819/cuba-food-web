import { cn } from '@/shared/lib/cn'

/** Trazo de pincel para subrayar a mano (decorativo). pathLength=1 permite dibujarlo. */
export function Swoosh({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 24"
      fill="none"
      className={cn('pointer-events-none', className)}
    >
      <path
        d="M4 19C52 8 118 3 196 6"
        pathLength={1}
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}
