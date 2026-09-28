import { useCallback, useEffect, useState } from 'react'
import type { DependencyList } from 'react'

export type AsyncState<T> =
  | { status: 'loading'; data: undefined; error: undefined }
  | { status: 'success'; data: T; error: undefined }
  | { status: 'error'; data: undefined; error: Error }

type Settled<T> = Exclude<AsyncState<T>, { status: 'loading' }>

const LOADING = { status: 'loading', data: undefined, error: undefined } as const

function sameDeps(a: DependencyList, b: DependencyList): boolean {
  return a.length === b.length && a.every((value, i) => Object.is(value, b[i]))
}

/**
 * Ejecuta una función async (típicamente un repositorio) y expone su estado.
 * "loading" se deriva: el resultado guardado solo vale para las dependencias con que se pidió,
 * así se ignoran respuestas obsoletas sin setState síncrono dentro del efecto.
 */
export function useAsync<T>(
  fn: () => Promise<T>,
  deps: DependencyList,
): AsyncState<T> & { reload: () => void } {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<{ deps: DependencyList; value: Settled<T> } | null>(null)
  const currentDeps = [...deps, attempt]

  useEffect(() => {
    let active = true
    const requestDeps = currentDeps
    fn().then(
      (data) => {
        if (active)
          setResult({
            deps: requestDeps,
            value: { status: 'success', data, error: undefined },
          })
      },
      (error: unknown) => {
        if (active)
          setResult({
            deps: requestDeps,
            value: {
              status: 'error',
              data: undefined,
              error: error instanceof Error ? error : new Error(String(error)),
            },
          })
      },
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las dependencias las define quien llama
  }, currentDeps)

  const reload = useCallback(() => setAttempt((n) => n + 1), [])
  const state: AsyncState<T> = result && sameDeps(result.deps, currentDeps) ? result.value : LOADING
  return { ...state, reload }
}
