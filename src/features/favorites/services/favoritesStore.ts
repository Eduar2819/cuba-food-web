import type { Favorite } from '../types'

/**
 * Contrato del almacén de favoritos. Hoy: localStorage (anónimo, por dispositivo).
 * Mañana: API + auth implementando la misma interfaz; la UI no cambia.
 */
export interface FavoritesStore {
  /** Instantánea síncrona e inmutable para useSyncExternalStore. */
  getSnapshot(): readonly Favorite[]
  subscribe(listener: () => void): () => void
  add(restaurantId: string): Promise<void>
  remove(restaurantId: string): Promise<void>
  toggle(restaurantId: string): Promise<boolean>
}

const STORAGE_KEY = 'sabor-cubano:favoritos:v1'

function isFavorite(value: unknown): value is Favorite {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Favorite).restaurantId === 'string' &&
    typeof (value as Favorite).savedAt === 'string'
  )
}

export function createLocalFavoritesStore(
  storage: Storage | null = safeLocalStorage(),
): FavoritesStore {
  const listeners = new Set<() => void>()
  let snapshot: readonly Favorite[] = read()

  function read(): Favorite[] {
    if (!storage) return []
    try {
      const parsed: unknown = JSON.parse(storage.getItem(STORAGE_KEY) ?? '[]')
      return Array.isArray(parsed) ? parsed.filter(isFavorite) : []
    } catch {
      return []
    }
  }

  function commit(next: Favorite[]) {
    snapshot = next
    try {
      storage?.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Cuota llena o modo privado: se conserva en memoria.
    }
    listeners.forEach((listener) => listener())
  }

  // Sincroniza entre pestañas.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY) return
      snapshot = read()
      listeners.forEach((listener) => listener())
    })
  }

  const store: FavoritesStore = {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    async add(restaurantId) {
      if (snapshot.some((f) => f.restaurantId === restaurantId)) return
      commit([{ restaurantId, savedAt: new Date().toISOString() }, ...snapshot])
    },
    async remove(restaurantId) {
      commit(snapshot.filter((f) => f.restaurantId !== restaurantId))
    },
    async toggle(restaurantId) {
      const saved = snapshot.some((f) => f.restaurantId === restaurantId)
      if (saved) await store.remove(restaurantId)
      else await store.add(restaurantId)
      return !saved
    },
  }
  return store
}

function safeLocalStorage(): Storage | null {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null
  } catch {
    return null
  }
}

export const favoritesStore: FavoritesStore = createLocalFavoritesStore()
