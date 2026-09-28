import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { chipStyles } from './chipStyles'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Si se define, el chip es un toggle (aria-pressed). */
  selected?: boolean
  icon?: LucideIcon
  tone?: 'default' | 'onPhoto'
}

export function Chip({
  selected,
  icon: Icon,
  tone = 'default',
  className,
  children,
  type = 'button',
  ...rest
}: ChipProps) {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={cn(chipStyles({ selected: Boolean(selected), tone }), className)}
      {...rest}
    >
      {Icon && <Icon aria-hidden size={16} />}
      {children}
    </button>
  )
}
