import { estimateMinutes, formatDistance, suggestedMode } from '@/shared/lib/geo'

/** "1.2 km · 4 min en auto" / "350 m · 5 min a pie" */
export function distanceLabel(km: number): string {
  const mode = suggestedMode(km)
  const minutes = estimateMinutes(km, mode)
  const time =
    minutes >= 60
      ? `${Math.floor(minutes / 60)} h ${minutes % 60 ? `${minutes % 60} min` : ''}`.trim()
      : `${minutes} min`
  return `${formatDistance(km)} · ${time} ${mode === 'walk' ? 'a pie' : 'en auto'}`
}

/** A partir de esta distancia avisamos que el usuario parece estar lejos de Mérida. */
export const FAR_AWAY_KM = 80
