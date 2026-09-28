import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { favoritesStore } from '../services/favoritesStore'

export function useFavorites() {
  const favorites = useSyncExternalStore(
    favoritesStore.subscribe,
    favoritesStore.getSnapshot,
    favoritesStore.getSnapshot,
  )
  const ids = useMemo(() => new Set(favorites.map((f) => f.restaurantId)), [favorites])
  const isFavorite = useCallback((id: string) => ids.has(id), [ids])
  return { favorites, isFavorite, toggle: favoritesStore.toggle, remove: favoritesStore.remove }
}
