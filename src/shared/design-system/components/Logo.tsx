import { cn } from '@/shared/lib/cn'

/**
 * Marca: cuadrado añil con círculo guayaba (la "puerta de color" de la fachada)
 * + wordmark en Bricolage. Marca geométrica simple, sin ilustración.
 */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <svg aria-hidden viewBox="0 0 32 32" className="size-8 shrink-0">
        <rect width="32" height="32" rx="9" className="fill-anil-900 dark:fill-anil-200" />
        <circle cx="16" cy="16" r="7" className="fill-guayaba-500" />
      </svg>
      {!compact && (
        <span className="font-display text-[1.1875rem] leading-none font-bold tracking-[-0.02em] text-ink">
          Sabor Cubano
          <span className="sr-only"> en Mérida</span>
        </span>
      )}
    </span>
  )
}
