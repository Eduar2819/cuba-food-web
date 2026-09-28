/**
 * Simulación de red para los repositorios demo.
 * Latencia configurable; en tests se pone a 0. Permite forzar errores para probar estados de UI
 * (en dev: localStorage.setItem('demo:fail', '1')).
 */
interface MockApiConfig {
  latencyMs: [min: number, max: number]
}

const config: MockApiConfig = {
  latencyMs: import.meta.env.MODE === 'test' ? [0, 0] : [220, 520],
}

export function configureMockApi(partial: Partial<MockApiConfig>) {
  Object.assign(config, partial)
}

function shouldFail(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem('demo:fail') === '1'
  } catch {
    return false
  }
}

export class MockNetworkError extends Error {
  constructor() {
    super('Error de red simulado')
    this.name = 'MockNetworkError'
  }
}

/** Devuelve una copia profunda del dato tras una latencia simulada. */
export async function mockResponse<T>(data: T): Promise<T> {
  const [min, max] = config.latencyMs
  const ms = min + Math.random() * (max - min)
  if (ms > 0) await new Promise((resolve) => setTimeout(resolve, ms))
  if (shouldFail()) throw new MockNetworkError()
  return structuredClone(data)
}
