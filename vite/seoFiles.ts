import { fileURLToPath, URL } from 'node:url'
import { createServer, loadEnv } from 'vite'
import type { Plugin } from 'vite'

interface SitemapModule {
  sitemapEntries: () => unknown[]
  buildSitemapXml: (siteUrl: string, entries: unknown[]) => string
  buildRobotsTxt: (siteUrl: string) => string
}

/**
 * Genera sitemap.xml y robots.txt en el build a partir de los datos del proyecto.
 * Carga src/features/seo/services/sitemap.ts con ssrLoadModule (TS + alias @ resueltos por Vite).
 */
export function seoFiles(): Plugin {
  let siteUrl = 'https://sabor-cubano.example'
  return {
    name: 'sabor-cubano:seo-files',
    apply: 'build',
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, 'VITE_')
      if (env.VITE_SITE_URL) siteUrl = env.VITE_SITE_URL
    },
    async generateBundle() {
      const server = await createServer({
        configFile: false,
        logLevel: 'silent',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false, ws: false },
        optimizeDeps: { noDiscovery: true, include: [] },
        resolve: { alias: { '@': fileURLToPath(new URL('../src', import.meta.url)) } },
      })
      try {
        const mod = (await server.ssrLoadModule(
          '/src/features/seo/services/sitemap.ts',
        )) as SitemapModule
        const entries = mod.sitemapEntries()
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: mod.buildSitemapXml(siteUrl, entries),
        })
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: mod.buildRobotsTxt(siteUrl),
        })
      } finally {
        await server.close()
      }
    },
  }
}
