import { useEffect, useState } from 'react'

/**
 * Hora actual que se refresca al cambiar el minuto (para estados abierto/cerrado).
 * En desarrollo, `?ahora=2026-10-02T21:00` fija la hora local de Mérida para probar estados.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => readOverride() ?? new Date())

  useEffect(() => {
    if (readOverride()) return
    const tick = () => setNow(new Date())
    // Alinea el primer tick con el cambio de minuto.
    const firstDelay = intervalMs - (Date.now() % intervalMs)
    let interval: number | undefined
    const timeout = window.setTimeout(() => {
      tick()
      interval = window.setInterval(tick, intervalMs)
    }, firstDelay)
    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [intervalMs])

  return now
}

function readOverride(): Date | null {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('ahora')
  if (!value) return null
  const date = new Date(`${value}:00-06:00`)
  return Number.isNaN(date.getTime()) ? null : date
}
