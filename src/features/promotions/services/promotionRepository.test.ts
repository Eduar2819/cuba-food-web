import type { Promotion } from '../types'
import {
  appliesOn,
  getPromotionStatus,
  promotionRepository,
  visiblePromotions,
} from './promotionRepository'

const base: Omit<Promotion, 'id' | 'startsOn' | 'endsOn'> = {
  isDemo: true,
  restaurantId: 'r',
  title: 't',
  description: 'd',
  conditions: [],
  image: { photoId: 'x', alt: 'x', credit: { author: '', username: '', slug: '' } },
}

const promo = (id: string, startsOn: string, endsOn: string, weekdays?: Promotion['weekdays']) =>
  ({ ...base, id, startsOn, endsOn, weekdays }) as Promotion

describe('promociones', () => {
  it('calcula vigencia inclusiva', () => {
    const p = promo('a', '2026-09-01', '2026-09-30')
    expect(getPromotionStatus(p, '2026-08-31')).toBe('upcoming')
    expect(getPromotionStatus(p, '2026-09-01')).toBe('active')
    expect(getPromotionStatus(p, '2026-09-30')).toBe('active')
    expect(getPromotionStatus(p, '2026-10-01')).toBe('expired')
  })

  it('respeta los días de la semana', () => {
    const thursdays = promo('b', '2026-09-01', '2026-12-31', [4])
    expect(appliesOn(thursdays, '2026-10-01', 4)).toBe(true)
    expect(appliesOn(thursdays, '2026-10-02', 5)).toBe(false)
  })

  it('oculta vencidas y ordena activas antes que próximas', () => {
    const now = new Date('2026-09-28T12:00:00-06:00')
    const list = visiblePromotions(
      [
        promo('expired', '2026-07-01', '2026-08-31'),
        promo('upcoming', '2026-10-01', '2026-10-31'),
        promo('active-late', '2026-09-01', '2026-12-31'),
        promo('active-soon', '2026-09-01', '2026-10-15'),
      ],
      now,
    )
    expect(list.map((p) => p.id)).toEqual(['active-soon', 'active-late', 'upcoming'])
  })

  it('el repositorio nunca devuelve la promoción vencida del mock', async () => {
    const list = await promotionRepository.getVisible(new Date('2026-09-28T12:00:00-06:00'))
    expect(list.some((p) => p.id === 'p-verano')).toBe(false)
    expect(list.length).toBeGreaterThan(0)
  })
})
