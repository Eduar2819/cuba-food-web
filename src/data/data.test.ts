import { BLOG_POSTS } from './blog'
import { CUISINES, SERVICES } from './catalog'
import { DISHES } from './dishes'
import { EVENTS } from './events'
import { PROMOTIONS } from './promotions'
import { RESTAURANTS } from './restaurants'
import { CITIES, NEIGHBORHOODS } from './zones'

const dishIds = new Set(DISHES.map((d) => d.id))
const restaurantIds = new Set(RESTAURANTS.map((r) => r.id))

describe('integridad de los datos demo', () => {
  it('slugs únicos', () => {
    for (const list of [RESTAURANTS, DISHES, EVENTS, BLOG_POSTS, CITIES]) {
      const slugs = list.map((item) => item.slug)
      expect(new Set(slugs).size).toBe(slugs.length)
    }
  })

  it('incluye los 4 restaurantes del brief', () => {
    const names = RESTAURANTS.map((r) => r.name)
    expect(names).toEqual(
      expect.arrayContaining([
        'La Habana del Caribe',
        'Sabor de Cuba',
        'Habana 1959',
        'El Rincón Cubano',
      ]),
    )
  })

  it.each(RESTAURANTS.map((r) => [r.name, r] as const))(
    '%s: referencias válidas y demo',
    (_, r) => {
      expect(r.isDemo).toBe(true)
      expect(CITIES.some((c) => c.id === r.address.cityId)).toBe(true)
      const neighborhood = NEIGHBORHOODS.find((n) => n.id === r.address.neighborhoodId)
      expect(neighborhood?.cityId).toBe(r.address.cityId)
      r.dishIds.forEach((id) => expect(dishIds.has(id), id).toBe(true))
      r.cuisineIds.forEach((id) =>
        expect(
          CUISINES.some((c) => c.id === id),
          id,
        ).toBe(true),
      )
      r.serviceIds.forEach((id) =>
        expect(
          SERVICES.some((s) => s.id === id),
          id,
        ).toBe(true),
      )
      if (r.menu?.type === 'structured') {
        r.menu.categories
          .flatMap((c) => c.items)
          .forEach(
            (item) => item.dishId && expect(dishIds.has(item.dishId), item.dishId).toBe(true),
          )
      }
    },
  )

  it('placeholders evidentes: teléfonos 000, redes en example.com, direcciones "Demo"', () => {
    for (const r of RESTAURANTS) {
      const phones = [r.contact.phone, r.contact.whatsapp].filter(Boolean) as string[]
      phones.forEach((p) => expect(p).toMatch(/^\+?52\d{3}0000\d{3}$/))
      r.social.forEach((s) => expect(new URL(s.url).hostname).toBe('example.com'))
      expect(r.address.street).toContain('Demo')
    }
  })

  it('eventos y promociones apuntan a restaurantes existentes', () => {
    ;[...EVENTS, ...PROMOTIONS].forEach((item) =>
      expect(restaurantIds.has(item.restaurantId), item.restaurantId).toBe(true),
    )
  })

  it('hay 7 artículos de blog con platillos relacionados válidos', () => {
    expect(BLOG_POSTS).toHaveLength(7)
    BLOG_POSTS.flatMap((p) => p.relatedDishIds).forEach((id) =>
      expect(dishIds.has(id), id).toBe(true),
    )
  })
})
