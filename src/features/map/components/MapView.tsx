import { Suspense } from 'react'
import { Skeleton } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { useMapAdapter } from '../services/mapAdapterContext'
import type { MapViewProps } from '../types'

/** Mapa desacoplado del proveedor: la implementación activa se carga solo al mostrarse. */
export function MapView(props: MapViewProps) {
  const { Component } = useMapAdapter()
  return (
    <Suspense
      fallback={
        <div className={cn('relative', props.className)}>
          <Skeleton className="absolute inset-0 rounded-none" />
          <p className="sr-only">Cargando mapa…</p>
        </div>
      }
    >
      <Component {...props} />
    </Suspense>
  )
}
