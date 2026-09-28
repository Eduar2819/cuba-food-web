import { cn } from '@/shared/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'subtle' | 'overlay'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'group/btn relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap select-none ' +
  'transition-[background-color,color,box-shadow,transform] duration-(--dur-micro) ease-out-soft ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-on-accent hover:bg-accent-hover shadow-low',
  secondary: 'bg-brand text-on-brand hover:bg-brand-hover',
  ghost: 'bg-transparent text-ink ring-1 ring-inset ring-line-strong hover:bg-surface-sunken',
  subtle: 'bg-surface-sunken text-ink hover:bg-line',
  // Sobre fotografía: fondo sólido para garantizar contraste (sin blur en contenido que hace scroll).
  overlay: 'bg-white/95 text-anil-950 shadow-low hover:bg-white',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-10 px-4 text-small',
  md: 'min-h-11 px-5 text-small',
  lg: 'min-h-13 px-6 text-body',
}

// Con icono "isla" anidado el padding derecho se reduce para quedar a ras.
const islandPadding: Record<ButtonSize, string> = {
  sm: 'pr-1.5',
  md: 'pr-1.5',
  lg: 'pr-2',
}

export interface ButtonStyleOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  withIsland?: boolean
}

/** Clases de botón para aplicarlas a otros elementos (Link, <a>). */
export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  withIsland = false,
}: ButtonStyleOptions = {}): string {
  return cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    withIsland && islandPadding[size],
  )
}
