import { Skeleton } from '@/shared/design-system'
import type { DirectoryItem } from '@/features/filters'

/** Vista de mapa del directorio (se implementa con MapProvider en la fase de mapa). */
export function DirectoryMap({ items }: { items: DirectoryItem[]; now: Date }) {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/3] w-full rounded-lg" />
      <p className="text-small text-ink-muted">{items.length} restaurantes en el mapa</p>
    </div>
  )
}
