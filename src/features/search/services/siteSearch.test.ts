import { DISH_CATEGORIES } from '@/data/catalog'
import { DISHES } from '@/data/dishes'
import { RESTAURANTS } from '@/data/restaurants'
import { CITIES, NEIGHBORHOODS } from '@/data/zones'
import { normalizeText } from '@/shared/lib/text'
import { createSearchIndex } from './searchIndex'
import { buildSearchDocuments } from './siteSearch'

const engine = createSearchIndex(
  buildSearchDocuments({
    restaurants: RESTAURANTS,
    dishes: DISHES,
    dishCategories: DISH_CATEGORIES,
    cities: CITIES,
    neighborhoods: NEIGHBORHOODS,
  }),
)
const titles = (query: string, kind?: Parameters<typeof engine.search>[1]) =>
  engine.search(query, kind).map((r) => r.doc.title)

describe('normalizeText', () => {
  it('quita acentos y mayúsculas pero conserva la ñ', () => {
    expect(normalizeText('  Mérida, CAFETERÍA  ')).toBe('merida cafeteria')
    expect(normalizeText('Año Nuevo')).toBe('año nuevo')
  })
})

describe('búsqueda global', () => {
  it('"ropa vieja" encuentra el platillo primero y los restaurantes que lo sirven', () => {
    const results = engine.search('ropa vieja')
    expect(results[0]?.doc.title).toBe('Ropa vieja')
    const restaurants = titles('ropa vieja', { kinds: ['restaurante'] })
    expect(restaurants).toContain('La Habana del Caribe')
    expect(restaurants).not.toContain('Café Mamoncillo')
  })

  it('"Mérida" y "merida" son equivalentes y devuelven la zona', () => {
    expect(titles('Mérida')).toEqual(titles('merida'))
    expect(titles('MERIDA', { kinds: ['zona'] })[0]).toBe('Mérida')
  })

  it('"cafetería" sin acento encuentra la categoría y las cafeterías', () => {
    expect(titles('cafeteria', { kinds: ['categoria'] })).toContain('Cafeterías')
    const places = titles('cafetería', { kinds: ['restaurante'] })
    expect(places).toEqual(expect.arrayContaining(['Café Mamoncillo', 'Casa Trinidad']))
  })

  it('sinónimos: "moros y cristianos" lleva al congrí; "medianoche" al sándwich', () => {
    expect(titles('moros y cristianos', { kinds: ['platillo'] })[0]).toBe('Congrí')
    expect(titles('medianoche', { kinds: ['platillo'] })[0]).toBe('Sándwich cubano')
  })

  it('prefijos y plural: "croquet" y "tostones"', () => {
    expect(titles('croquet', { kinds: ['platillo'] })).toContain('Croquetas')
    expect(titles('toston', { kinds: ['platillo'] })).toContain('Tostones')
  })

  it('todas las palabras deben coincidir (AND)', () => {
    expect(titles('sandwich progreso', { kinds: ['restaurante'] })).toEqual([])
    expect(titles('camarones progreso', { kinds: ['restaurante'] })).toContain('Sabor de Cuba')
  })

  it('consulta vacía o de puras palabras vacías no devuelve nada', () => {
    expect(engine.search('   ')).toEqual([])
    expect(engine.search('de la')).toEqual([])
  })
})
