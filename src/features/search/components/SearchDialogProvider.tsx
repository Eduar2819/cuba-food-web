import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { SearchDialogContext } from '../hooks/searchDialogContext'
import type { SearchDialogApi } from '../hooks/searchDialogContext'
import { SearchDialog } from './SearchDialog'

/** Búsqueda global: se abre desde la navbar, la barra inferior o con "/" y Ctrl/⌘+K. */
export function SearchDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialQuery, setInitialQuery] = useState('')

  const open = useCallback((query = '') => {
    setInitialQuery(query)
    setIsOpen(true)
  }, [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')
      if (
        (event.key === 'k' && (event.metaKey || event.ctrlKey)) ||
        (event.key === '/' && !typing)
      ) {
        event.preventDefault()
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const api = useMemo<SearchDialogApi>(() => ({ open, close, isOpen }), [open, close, isOpen])

  return (
    <SearchDialogContext value={api}>
      {children}
      {isOpen && <SearchDialog initialQuery={initialQuery} onClose={close} />}
    </SearchDialogContext>
  )
}
