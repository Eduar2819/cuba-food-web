import type { Plugin } from 'vite'
import { HERO_IMAGE } from '../src/app/routes/home/heroImages.ts'

/**
 * Precarga la imagen LCP del hero, solo cuando la SPA arranca en "/" (index.html es común a
 * todas las rutas y no queremos descargarla en las demás).
 */
export function heroPreload(): Plugin {
  return {
    name: 'sabor-cubano:hero-preload',
    transformIndexHtml() {
      const script = [
        "if (location.pathname === '/') {",
        "  var l = document.createElement('link');",
        "  l.rel = 'preload'; l.as = 'image'; l.fetchPriority = 'high';",
        `  l.href = ${JSON.stringify(HERO_IMAGE.src)};`,
        `  l.imageSrcset = ${JSON.stringify(HERO_IMAGE.srcSet)};`,
        `  l.imageSizes = ${JSON.stringify(HERO_IMAGE.sizes)};`,
        '  document.head.appendChild(l);',
        '}',
      ].join('\n')
      return [{ tag: 'script', children: script, injectTo: 'head-prepend' }]
    },
  }
}
