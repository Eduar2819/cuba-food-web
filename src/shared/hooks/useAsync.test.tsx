import { act, renderHook, waitFor } from '@testing-library/react'
import { useAsync } from './useAsync'

describe('useAsync', () => {
  it('pasa de loading a success', async () => {
    const { result } = renderHook(() => useAsync(() => Promise.resolve(42), []))
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toBe(42)
  })

  it('expone el error y permite reintentar', async () => {
    let calls = 0
    const fn = () => {
      calls += 1
      return calls === 1 ? Promise.reject(new Error('falló')) : Promise.resolve('ok')
    }
    const { result } = renderHook(() => useAsync(fn, []))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toBe('falló')
    act(() => result.current.reload())
    expect(result.current.status).toBe('loading')
    await waitFor(() => expect(result.current.data).toBe('ok'))
  })

  it('ignora respuestas obsoletas al cambiar dependencias', async () => {
    const resolvers: Record<string, (v: string) => void> = {}
    const { result, rerender } = renderHook(
      ({ id }) => useAsync(() => new Promise<string>((r) => (resolvers[id] = r)), [id]),
      { initialProps: { id: 'a' } },
    )
    rerender({ id: 'b' })
    await act(async () => resolvers.a?.('A'))
    expect(result.current.status).toBe('loading')
    await act(async () => resolvers.b?.('B'))
    expect(result.current.data).toBe('B')
  })
})
