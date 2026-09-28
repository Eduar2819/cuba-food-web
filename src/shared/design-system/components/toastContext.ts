import { createContext, useContext } from 'react'

export type ToastTone = 'neutral' | 'success' | 'danger'

export interface ToastOptions {
  message: string
  tone?: ToastTone
  /** ms; por defecto 4000 */
  duration?: number
}

export interface ToastApi {
  show: (options: ToastOptions | string) => void
}

export const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de <ToastProvider>')
  return ctx
}
