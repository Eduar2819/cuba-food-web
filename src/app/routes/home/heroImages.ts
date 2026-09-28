// Imports relativos a propósito: este módulo también lo carga vite.config (sin alias @).
import type { ResponsiveImageOptions } from '../../../shared/lib/images.ts'
import { IMAGES } from '../../../data/images.ts'

/*
 * Imágenes del hero en un módulo sin dependencias de React: vite.config lo importa
 * para inyectar el <link rel="preload"> del LCP en index.html.
 */
export const HERO_BACKGROUND = IMAGES.platoCubano
export const HERO_PLATE = IMAGES.mojito

export const HERO_BACKGROUND_OPTIONS: ResponsiveImageOptions = {
  ratio: '3/2',
  sizes: '100vw',
  widths: [640, 960, 1280, 1600, 2000],
  quality: 65,
}
