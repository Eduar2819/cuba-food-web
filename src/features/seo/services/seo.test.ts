import { RESTAURANTS } from '@/data/restaurants'
import { restaurantJsonLd } from './schema'
import { buildRobotsTxt, buildSitemapXml, sitemapEntries } from './sitemap'

describe('sitemap y robots', () => {
  const entries = sitemapEntries(new Date('2026-09-28T12:00:00-06:00'))
  const paths = entries.map((e) => e.path)

  it('incluye rutas estáticas y dinámicas; excluye favoritos, design-system y eventos pasados', () => {
    expect(paths).toContain('/')
    expect(paths).toContain('/restaurantes/habana-1959')
    expect(paths).toContain('/platillos/congri')
    expect(paths).toContain('/zonas/merida')
    expect(paths).toContain('/blog/cocina-cubana-y-yucateca')
    expect(paths).toContain('/eventos/noche-de-son')
    expect(paths).not.toContain('/eventos/tarde-de-domino')
    expect(paths).not.toContain('/favoritos')
    expect(paths.some((p) => p.includes('design-system'))).toBe(false)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('genera XML válido con URLs absolutas', () => {
    const xml = buildSitemapXml('https://ejemplo.test/', entries.slice(0, 2))
    expect(xml).toContain('<loc>https://ejemplo.test/</loc>')
    expect(xml).toContain('<loc>https://ejemplo.test/restaurantes</loc>')
    expect(
      new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror'),
    ).toBeNull()
  })

  it('robots.txt apunta al sitemap', () => {
    expect(buildRobotsTxt('https://ejemplo.test')).toContain(
      'Sitemap: https://ejemplo.test/sitemap.xml',
    )
  })
})

describe('JSON-LD', () => {
  it('Restaurant con dirección, geo y horarios; sin aggregateRating (datos demo)', () => {
    const r = RESTAURANTS.find((x) => x.slug === 'tostones-y-co')!
    const ld = restaurantJsonLd(r, 'Mérida', 'Paseo de Montejo')
    expect(ld).toMatchObject({
      '@type': 'Restaurant',
      name: 'Tostones & Co.',
      address: { addressRegion: 'Yucatán', addressCountry: 'MX' },
      geo: { latitude: r.address.location.lat },
    })
    expect(ld).not.toHaveProperty('aggregateRating')
    expect(ld.openingHoursSpecification).toContainEqual(
      expect.objectContaining({ dayOfWeek: 'Friday', opens: '12:00', closes: '03:00' }),
    )
  })
})
