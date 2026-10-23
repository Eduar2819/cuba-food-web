// Imports relativos a propósito: este módulo también lo carga vite.config (sin alias @).
import { IMAGES } from '../../../data/images.ts'

/*
 * Imágenes del hero en un módulo sin dependencias de React: vite.config lo importa
 * para inyectar el <link rel="preload"> del LCP en index.html.
 */

/** Imagen para compartir en redes (Open Graph): foto del CDN con URL absoluta estable. */
export const HERO_BACKGROUND = IMAGES.platoCubano

const widths = [640, 960, 1280, 1672] as const

/**
 * Fondo del hero: ilustración de La Habana (public/images). WebP en 4 anchos generados a
 * partir de hero-cuba.png (original 1672×941).
 */
export const HERO_IMAGE = {
  src: '/images/hero-cuba-1280.webp',
  srcSet: widths.map((w) => `/images/hero-cuba-${w}.webp ${w}w`).join(', '),
  // El marco nunca supera el contenedor de la página (82.5rem menos el margen interior).
  sizes: '(min-width: 1320px) 1256px, calc(100vw - 2rem)',
  width: 1672,
  height: 941,
}
