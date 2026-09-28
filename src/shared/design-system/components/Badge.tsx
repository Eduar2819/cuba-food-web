import type { HTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type BadgeTone =
  'neutral' | 'brand' | 'accent' | 'open' | 'soon' | 'closed' | 'highlight' | 'demo'

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-surface-sunken text-ink',
  brand: 'bg-brand text-on-brand',
  accent: 'bg-accent-soft text-accent-text',
  open: 'bg-status-open-soft text-status-open',
  soon: 'bg-status-soon-soft text-status-soon',
  closed: 'bg-status-closed-soft text-status-closed',
  highlight: 'bg-mamoncillo-400 text-anil-950',
  demo: 'bg-transparent text-ink-muted ring-1 ring-inset ring-line-strong',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  icon?: LucideIcon
}

export function Badge({ tone = 'neutral', icon: Icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-semibold whitespace-nowrap',
        tones[tone],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon aria-hidden size={14} strokeWidth={2} />}
      {children}
    </span>
  )
}
