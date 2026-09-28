import type { ButtonHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export type IconButtonVariant = 'ghost' | 'subtle' | 'solid' | 'overlay' | 'accent'

const variants: Record<IconButtonVariant, { surface: string; text: string }> = {
  ghost: { surface: 'hover:bg-surface-sunken', text: 'text-ink' },
  subtle: { surface: 'bg-surface-sunken hover:bg-line', text: 'text-ink' },
  solid: { surface: 'bg-brand hover:bg-brand-hover', text: 'text-on-brand' },
  overlay: { surface: 'bg-white/95 shadow-low hover:bg-white', text: 'text-anil-950' },
  accent: { surface: 'bg-accent hover:bg-accent-hover', text: 'text-on-accent' },
}

// Estado "activo" (p. ej. guardado): icono relleno en guayaba, salvo sobre superficies de color.
const filledText: Record<IconButtonVariant, string> = {
  ghost: 'text-accent-text',
  subtle: 'text-accent-text',
  solid: 'text-on-brand',
  overlay: 'text-guayaba-600',
  accent: 'text-on-accent',
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon
  /** Texto accesible obligatorio: el botón no tiene texto visible. */
  label: string
  variant?: IconButtonVariant
  size?: 'md' | 'lg'
  /** Estado activo: rellena el icono en color de acento (p. ej. corazón guardado). */
  filled?: boolean
}

export function IconButton({
  icon: Icon,
  label,
  variant = 'ghost',
  size = 'md',
  filled = false,
  className,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full',
        'transition-[background-color,color,transform] duration-(--dur-micro) ease-out-soft active:scale-[0.94]',
        'disabled:pointer-events-none disabled:opacity-50',
        size === 'md' ? 'size-11' : 'size-13',
        variants[variant].surface,
        filled ? filledText[variant] : variants[variant].text,
        className,
      )}
      {...rest}
    >
      <Icon aria-hidden size={size === 'md' ? 20 : 22} fill={filled ? 'currentColor' : 'none'} />
    </button>
  )
}
