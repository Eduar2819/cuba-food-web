import { createContext, useContext } from 'react'

export interface SearchDialogApi {
  open: (initialQuery?: string) => void
  close: () => void
  isOpen: boolean
}

export const SearchDialogContext = createContext<SearchDialogApi | null>(null)

export function useSearchDialog(): SearchDialogApi {
  const ctx = useContext(SearchDialogContext)
  if (!ctx) throw new Error('useSearchDialog debe usarse dentro de <SearchDialogProvider>')
  return ctx
}
