import { createLocalFavoritesStore } from './favoritesStore'

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial))
  return {
    get length() {
      return data.size
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, v),
  }
}

describe('favoritesStore (localStorage)', () => {
  it('agrega, alterna y persiste', async () => {
    const storage = memoryStorage()
    const store = createLocalFavoritesStore(storage)
    await store.add('r1')
    expect(store.getSnapshot().map((f) => f.restaurantId)).toEqual(['r1'])
    expect(await store.toggle('r1')).toBe(false)
    expect(store.getSnapshot()).toHaveLength(0)
    expect(await store.toggle('r2')).toBe(true)
    // Una nueva instancia lee lo persistido.
    expect(createLocalFavoritesStore(storage).getSnapshot()[0]?.restaurantId).toBe('r2')
  })

  it('no duplica y notifica a los suscriptores', async () => {
    const store = createLocalFavoritesStore(memoryStorage())
    const listener = vi.fn()
    store.subscribe(listener)
    await store.add('r1')
    await store.add('r1')
    expect(store.getSnapshot()).toHaveLength(1)
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('tolera datos corruptos y ausencia de storage', () => {
    const corrupt = memoryStorage({ 'sabor-cubano:favoritos:v1': '{no json' })
    expect(createLocalFavoritesStore(corrupt).getSnapshot()).toEqual([])
    expect(createLocalFavoritesStore(null).getSnapshot()).toEqual([])
  })
})
