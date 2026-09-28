import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { ToastApi, ToastOptions, ToastTone } from './toastContext'
import { ToastContext } from './toastContext'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
  duration: number
}

const icons = { neutral: Info, success: CircleCheck, danger: CircleAlert }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const show = useCallback((options: ToastOptions | string) => {
    const opts = typeof options === 'string' ? { message: options } : options
    nextId.current += 1
    const item: ToastItem = {
      id: nextId.current,
      message: opts.message,
      tone: opts.tone ?? 'neutral',
      duration: opts.duration ?? 4000,
    }
    // Máximo 3 visibles.
    setItems((prev) => [...prev.slice(-2), item])
  }, [])

  const api = useMemo<ToastApi>(() => ({ show }), [show])

  return (
    <ToastContext value={api}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed inset-x-0 z-(--z-toast) flex flex-col items-center gap-2 px-4',
          // En móvil queda por encima de la barra inferior.
          'bottom-[calc(5rem+env(safe-area-inset-bottom))] desktop:bottom-8',
        )}
      >
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext>
  )
}

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const Icon = icons[item.tone]
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(item.id), item.duration)
    return () => window.clearTimeout(timer)
  }, [item.id, item.duration, onDismiss])

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-full py-2 pr-2 pl-4 shadow-high',
        'bg-surface-inverse text-ink-inverse',
        'animate-[toast-in_var(--dur-normal)_var(--ease-out-soft)]',
      )}
    >
      <Icon
        aria-hidden
        size={18}
        className={cn(
          item.tone === 'success' && 'text-palma-400 dark:text-palma-700',
          item.tone === 'danger' && 'text-guayaba-300 dark:text-coral-error-700',
        )}
      />
      <p className="flex-1 text-small font-medium">{item.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Cerrar aviso"
        className="flex size-11 items-center justify-center rounded-full hover:bg-current/10"
      >
        <X aria-hidden size={18} />
      </button>
    </div>
  )
}
