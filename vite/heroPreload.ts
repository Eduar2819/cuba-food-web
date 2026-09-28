import type { Plugin } from 'vite'
import { responsiveImage } from '../src/shared/lib/images.ts'
import { HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS } from '../src/app/routes/home/heroImages.ts'

/**
 * Precarga la imagen LCP del hero, solo cuando la SPA arranca en "/" (index.html es común a
 * todas las rutas y no queremos descargarla en las demás).
 */
export function heroPreload(): Plugin {
  return {
    name: 'sabor-cubano:hero-preload',
    transformIndexHtml() {
      const image = responsiveImage(HERO_BACKGROUND, HERO_BACKGROUND_OPTIONS)
      const script = [
        "if (location.pathname === '/') {",
        "  var l = document.createElement('link');",
        "  l.rel = 'preload'; l.as = 'image'; l.fetchPriority = 'high';",
        `  l.href = ${JSON.stringify(image.src)};`,
        `  l.imageSrcset = ${JSON.stringify(image.srcSet)};`,
        `  l.imageSizes = ${JSON.stringify(image.sizes)};`,
        '  document.head.appendChild(l);',
        '}',
      ].join('\n')
      return [{ tag: 'script', children: script, injectTo: 'head-prepend' }]
    },
  }
}
