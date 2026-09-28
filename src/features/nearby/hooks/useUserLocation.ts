import { useSyncExternalStore } from 'react'
import { locationStore } from '../services/locationStore'

export function useUserLocation() {
  const state = useSyncExternalStore(
    locationStore.subscribe,
    locationStore.getSnapshot,
    locationStore.getSnapshot,
  )
  return { ...state, request: locationStore.request }
}
