import type { ButtonHTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { ButtonSize, ButtonStyleOptions } from './buttonStyles'
import { buttonStyles } from './buttonStyles'

interface ButtonContentProps {
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  size?: ButtonSize
  loading?: boolean
  children: ReactNode
}

/** Contenido de botón reutilizable: icono inicial + texto + icono "isla" anidado. */
export function ButtonContent({
  leadingIcon: Leading,
  trailingIcon: Trailing,
  size = 'md',
  loading,
  children,
}: ButtonContentProps) {
  const iconSize = size === 'lg' ? 20 : 18
  return (
    <>
      {loading ? (
        <LoaderCircle aria-hidden size={iconSize} className="animate-spin" />
      ) : (
        Leading && <Leading aria-hidden size={iconSize} />
      )}
      <span>{children}</span>
      {Trailing && (
        <span
          aria-hidden
          className={cn(
            'flex items-center justify-center rounded-full bg-current/15 transition-transform duration-(--dur-normal) ease-spring',
            'group-hover/btn:translate-x-0.5 group-hover/btn:scale-105',
            size === 'lg' ? 'size-9' : 'size-8',
          )}
        >
          <Trailing size={iconSize - 2} className="text-current" />
        </span>
      )}
    </>
  )
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, Omit<ButtonStyleOptions, 'withIsland'> {
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  loading?: boolean
}

export function Button({
  variant,
  size = 'md',
  fullWidth,
  leadingIcon,
  trailingIcon,
  loading = false,
  className,
  children,
  type = 'button',
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        buttonStyles({ variant, size, fullWidth, withIsland: Boolean(trailingIcon) }),
        className,
      )}
      {...rest}
    >
      <ButtonContent
        leadingIcon={leadingIcon}
        trailingIcon={trailingIcon}
        size={size}
        loading={loading}
      >
        {children}
      </ButtonContent>
    </button>
  )
}
