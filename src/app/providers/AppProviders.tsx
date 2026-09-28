import type { ReactNode } from 'react'
import { LucideProvider } from 'lucide-react'
import { ToastProvider } from '@/shared/design-system'

/** Proveedores globales. El trazo de iconos se fija aquí (design-dna: 1.5). */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LucideProvider strokeWidth={1.5}>
      <ToastProvider>{children}</ToastProvider>
    </LucideProvider>
  )
}
