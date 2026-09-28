import { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { cn } from '@/shared/lib/cn'

export interface TabItem {
  id: string
  label: string
  content: ReactNode
}

export interface TabsProps {
  items: TabItem[]
  /** Etiqueta accesible del grupo de pestañas. */
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (id: string) => void
  className?: string
}

/** Pestañas accesibles (patrón WAI-ARIA: flechas, Home/End, activación automática). */
export function Tabs({ items, label, value, defaultValue, onValueChange, className }: TabsProps) {
  const baseId = useId()
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id ?? '')
  const active = value ?? internal
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const select = (id: string) => {
    if (value === undefined) setInternal(id)
    onValueChange?.(id)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((item) => item.id === active)
    let next: number
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    else return
    event.preventDefault()
    const item = items[next]
    if (!item) return
    select(item.id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="-mx-1 scrollbar-none flex gap-1 overflow-x-auto px-1 pb-px"
      >
        {items.map((item, index) => {
          const selected = item.id === active
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el
              }}
              id={`${baseId}-tab-${item.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.id)}
              className={cn(
                'relative min-h-11 shrink-0 rounded-full px-4 text-small font-semibold whitespace-nowrap',
                'transition-colors duration-(--dur-micro) ease-out-soft',
                selected
                  ? 'bg-brand text-on-brand'
                  : 'text-ink-muted hover:bg-surface-sunken hover:text-ink',
              )}
            >
              {item.label}
            </button>
          )
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          id={`${baseId}-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-6 focus-visible:outline-offset-4"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  )
}
