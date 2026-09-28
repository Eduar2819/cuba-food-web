import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Field } from './Field'
import { controlBase, describedBy } from './fieldStyles'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string
  leadingIcon?: LucideIcon
  containerClassName?: string
}

export function Input({
  label,
  hideLabel,
  hint,
  error,
  leadingIcon: Leading,
  id: idProp,
  className,
  containerClassName,
  ...rest
}: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  return (
    <Field
      id={id}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <div className="relative">
        {Leading && (
          <Leading
            aria-hidden
            size={20}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-muted"
          />
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlBase, Leading ? 'pr-4 pl-12' : 'px-4', className)}
          {...rest}
        />
      </div>
    </Field>
  )
}
