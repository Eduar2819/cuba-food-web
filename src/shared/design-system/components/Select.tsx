import { useId } from 'react'
import type { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { Field } from './Field'
import { controlBase, describedBy } from './fieldStyles'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  options: SelectOption[]
  hideLabel?: boolean
  hint?: string
  error?: string
  placeholder?: string
  containerClassName?: string
}

export function Select({
  label,
  options,
  hideLabel,
  hint,
  error,
  placeholder,
  id: idProp,
  className,
  containerClassName,
  ...rest
}: SelectProps) {
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
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, hint, error)}
          className={cn(controlBase, 'cursor-pointer appearance-none pr-11 pl-4', className)}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          size={18}
          className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-ink-muted"
        />
      </div>
    </Field>
  )
}
