import { eventRepository } from './eventRepository'

describe('eventos', () => {
  it('solo devuelve eventos que no han terminado, ordenados por fecha', async () => {
    const list = await eventRepository.getUpcoming(new Date('2026-09-28T12:00:00-06:00'))
    expect(list.some((e) => e.slug === 'tarde-de-domino')).toBe(false)
    const starts = list.map((e) => e.startsAt)
    expect(starts).toEqual([...starts].sort())
  })

  it('un evento en curso sigue visible', async () => {
    const during = new Date('2026-10-02T21:00:00-06:00')
    const list = await eventRepository.getUpcoming(during)
    expect(list[0]?.slug).toBe('noche-de-son')
  })
})
