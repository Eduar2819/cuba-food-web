import type { KeyboardEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  icon?: LucideIcon
}

export interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Selector de una opción (radiogroup) con navegación por flechas. */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return
    event.preventDefault()
    const index = options.findIndex((o) => o.value === value)
    const next = options[(index + delta + options.length) % options.length]
    if (!next) return
    onChange(next.value)
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-value="${next.value}"]`)?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('inline-flex rounded-full bg-surface-sunken p-1', className)}
    >
      {options.map(({ value: optionValue, label: optionLabel, icon: Icon }) => {
        const selected = optionValue === value
        return (
          <button
            key={optionValue}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-value={optionValue}
            onClick={() => onChange(optionValue)}
            className={cn(
              'inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-small font-semibold',
              'transition-[background-color,color,box-shadow] duration-(--dur-normal) ease-out-soft',
              selected ? 'bg-surface text-ink shadow-low' : 'text-ink-muted hover:text-ink',
            )}
          >
            {Icon && <Icon aria-hidden size={16} />}
            {optionLabel}
          </button>
        )
      })}
    </div>
  )
}
