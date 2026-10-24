import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  description?: string
}

export function Checkbox({ label, description, id: idProp, className, ...rest }: CheckboxProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <div className={cn('flex items-start gap-3 py-2.5', className)}>
      <span className="relative mt-0.5 flex size-6 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          aria-describedby={description ? `${id}-desc` : undefined}
          className={cn(
            'peer size-6 cursor-pointer appearance-none rounded-sm bg-surface ring-1 ring-line-strong ring-inset',
            'transition-colors duration-(--dur-micro) ease-out-soft',
            'checked:bg-brand checked:ring-brand hover:ring-arena-400',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
          {...rest}
        />
        <Check
          aria-hidden
          size={16}
          strokeWidth={2.5}
          className="pointer-events-none absolute text-on-brand opacity-0 peer-checked:opacity-100"
        />
      </span>
      {/* Área clicable ampliada: la etiqueta cubre la fila completa, casilla incluida (>= 44px). */}
      <label
        htmlFor={id}
        className="relative flex min-h-7 flex-1 cursor-pointer flex-col after:absolute after:-inset-y-2.5 after:right-0 after:-left-9"
      >
        <span className="text-small font-medium text-ink">{label}</span>
        {description && (
          <span id={`${id}-desc`} className="text-caption text-ink-muted">
            {description}
          </span>
        )}
      </label>
    </div>
  )
}
