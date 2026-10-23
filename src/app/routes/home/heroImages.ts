// Imports relativos a propósito: este módulo también lo carga vite.config (sin alias @).
import type { ResponsiveImageOptions } from '../../../shared/lib/images.ts'
import { IMAGES } from '../../../data/images.ts'

/*
 * Imágenes del hero en un módulo sin dependencias de React: vite.config lo importa
 * para inyectar el <link rel="preload"> del LCP en index.html.
 */
export const HERO_BACKGROUND = IMAGES.platoCubano
export const HERO_PLATE = IMAGES.mojito
export const HERO_STREET = IMAGES.habanaCalle

/** Foto grande del collage: mitad derecha en desktop, bloque 4:3 en móvil. */
export const HERO_BACKGROUND_OPTIONS: ResponsiveImageOptions = {
  ratio: '1/1',
  sizes: '(min-width: 1024px) 54vw, 100vw',
  widths: [640, 960, 1280, 1600],
  quality: 68,
}
