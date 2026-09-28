import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { chipStyles } from './chipStyles'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Estado seleccionado. En modo toggle se expone con aria-pressed; en radio con aria-checked. */
  selected?: boolean
  mode?: 'toggle' | 'radio'
  icon?: LucideIcon
  tone?: 'default' | 'onPhoto'
}

export function Chip({
  selected,
  mode = 'toggle',
  icon: Icon,
  tone = 'default',
  className,
  children,
  type = 'button',
  ...rest
}: ChipProps) {
  const a11y =
    mode === 'radio'
      ? { role: 'radio' as const, 'aria-checked': Boolean(selected), tabIndex: selected ? 0 : -1 }
      : { 'aria-pressed': selected }
  return (
    <button
      type={type}
      {...a11y}
      className={cn(
        chipStyles({ selected: Boolean(selected), tone }),
        'disabled:pointer-events-none disabled:opacity-45',
        className,
      )}
      {...rest}
    >
      {Icon && <Icon aria-hidden size={16} />}
      {children}
    </button>
  )
}
