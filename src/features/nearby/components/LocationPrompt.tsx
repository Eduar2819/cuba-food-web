import { LocateFixed, MapPinOff } from 'lucide-react'
import { Button } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { useUserLocation } from '../hooks/useUserLocation'

const messages = {
  denied:
    'Tu navegador tiene bloqueada la ubicación. Actívala en los permisos del sitio para ordenar por cercanía.',
  unavailable: 'No pudimos obtener tu ubicación en este dispositivo.',
  timeout: 'Tardamos demasiado en obtener tu ubicación. Inténtalo de nuevo.',
} as const

/**
 * Estado "Sin ubicación": invita a activarla sin romper la experiencia.
 * El resto de la página sigue funcionando sin ella.
 */
export function LocationPrompt({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  const { status, request } = useUserLocation()
  if (status === 'granted') return null
  const problem = status === 'denied' || status === 'unavailable' || status === 'timeout'

  return (
    <div
      role="status"
      className={cn(
        'flex flex-col items-start gap-3 rounded-lg bg-surface-sunken p-5 tablet:flex-row tablet:items-center',
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
        {problem ? <MapPinOff aria-hidden size={20} /> : <LocateFixed aria-hidden size={20} />}
      </span>
      <p className={cn('flex-1 text-ink', compact ? 'text-small' : 'text-body')}>
        {problem
          ? messages[status]
          : 'Activa tu ubicación para descubrir restaurantes cerca de ti.'}
      </p>
      {status !== 'denied' && status !== 'unavailable' && (
        <Button
          variant="secondary"
          leadingIcon={LocateFixed}
          loading={status === 'locating'}
          onClick={request}
        >
          {status === 'timeout' ? 'Reintentar' : 'Activar ubicación'}
        </Button>
      )}
    </div>
  )
}
