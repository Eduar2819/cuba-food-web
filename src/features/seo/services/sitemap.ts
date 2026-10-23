import { BLOG_POSTS } from '@/data/blog'
import { DISHES } from '@/data/dishes'
import { EVENTS } from '@/data/events'
import { RESTAURANTS } from '@/data/restaurants'

export interface SitemapEntry {
  path: string
  /** YYYY-MM-DD */
  lastmod?: string
  changefreq?: 'daily' | 'weekly' | 'monthly'
  priority?: number
}

/** Rutas indexables (favoritos y /design-system quedan fuera: noindex / solo dev). */
const STATIC: SitemapEntry[] = [
  { path: '/', changefreq: 'daily', priority: 1 },
  { path: '/restaurantes', changefreq: 'daily', priority: 0.9 },
  { path: '/mapa', changefreq: 'weekly', priority: 0.7 },
  { path: '/platillos', changefreq: 'weekly', priority: 0.8 },
  { path: '/eventos', changefreq: 'daily', priority: 0.7 },
  { path: '/blog', changefreq: 'weekly', priority: 0.6 },
  { path: '/contacto', changefreq: 'monthly', priority: 0.3 },
]

/** Entradas del sitemap generadas a partir de los datos (mocks hoy, API mañana). */
export function sitemapEntries(now: Date = new Date()): SitemapEntry[] {
  return [
    ...STATIC,
    ...RESTAURANTS.map((r) => ({
      path: `/restaurantes/${r.slug}`,
      lastmod: r.createdAt,
      changefreq: 'weekly' as const,
      priority: 0.8,
    })),
    ...DISHES.map((d) => ({
      path: `/platillos/${d.slug}`,
      changefreq: 'monthly' as const,
      priority: 0.6,
    })),
    ...EVENTS.filter((e) => new Date(e.endsAt) > now).map((e) => ({
      path: `/eventos/${e.slug}`,
      changefreq: 'weekly' as const,
      priority: 0.5,
    })),
    ...BLOG_POSTS.map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: p.publishedAt,
      changefreq: 'monthly' as const,
      priority: 0.5,
    })),
  ]
}

const escapeXml = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function buildSitemapXml(siteUrl: string, entries: SitemapEntry[]): string {
  const base = siteUrl.replace(/\/$/, '')
  const urls = entries.map((e) =>
    [
      '  <url>',
      `    <loc>${escapeXml(base + e.path)}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority !== undefined ? `    <priority>${e.priority.toFixed(1)}</priority>` : null,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n'),
  )
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function buildRobotsTxt(siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, '')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /favoritos',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n')
}
