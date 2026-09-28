/**
 * Capa de imágenes. Hoy: CDN de Unsplash (parámetros imgix). Mañana: el CDN propio,
 * cambiando solo este archivo.
 */

export interface ImageCredit {
  author: string
  username: string
  /** slug de la foto en unsplash.com/photos/<slug> */
  slug: string
}

export interface ImageAsset {
  /** Identificador del CDN (p. ej. "photo-1746587021271-8de34530e438"). */
  photoId: string
  alt: string
  credit: ImageCredit
  /** Punto focal para object-position (CSS), p. ej. "50% 40%". */
  focus?: string
}

export type AspectRatio = '1/1' | '4/3' | '3/2' | '16/9' | '3/4' | '4/5' | '21/9'

const RATIOS: Record<AspectRatio, number> = {
  '1/1': 1,
  '4/3': 4 / 3,
  '3/2': 3 / 2,
  '16/9': 16 / 9,
  '3/4': 3 / 4,
  '4/5': 4 / 5,
  '21/9': 21 / 9,
}

export interface ImageUrlOptions {
  width: number
  ratio?: AspectRatio
  quality?: number
}

const CDN = 'https://images.unsplash.com'

export function imageUrl(asset: ImageAsset, { width, ratio, quality = 70 }: ImageUrlOptions) {
  const params = new URLSearchParams({
    auto: 'format', // AVIF/WebP según el navegador
    fit: 'crop',
    w: String(Math.round(width)),
    q: String(quality),
  })
  if (ratio) params.set('h', String(Math.round(width / RATIOS[ratio])))
  return `${CDN}/${asset.photoId}?${params.toString()}`
}

export const DEFAULT_WIDTHS = [400, 640, 960, 1280, 1600, 2000] as const

export interface ResponsiveImageOptions {
  ratio?: AspectRatio
  /** Atributo sizes (p. ej. "(min-width: 1024px) 33vw, 100vw"). */
  sizes?: string
  widths?: readonly number[]
  quality?: number
}

export interface ResponsiveImageProps {
  src: string
  srcSet: string
  sizes: string
  alt: string
  width: number
  height: number
  style?: { objectPosition: string }
}

/** Props listas para <img>: src, srcSet, sizes, alt y dimensiones intrínsecas (evita CLS). */
export function responsiveImage(
  asset: ImageAsset,
  { ratio = '4/3', sizes = '100vw', widths = DEFAULT_WIDTHS, quality }: ResponsiveImageOptions = {},
): ResponsiveImageProps {
  const largest = widths[widths.length - 1] ?? 1600
  const fallbackWidth = widths[Math.min(2, widths.length - 1)] ?? largest
  return {
    src: imageUrl(asset, { width: fallbackWidth, ratio, quality }),
    srcSet: widths.map((w) => `${imageUrl(asset, { width: w, ratio, quality })} ${w}w`).join(', '),
    sizes,
    alt: asset.alt,
    width: largest,
    height: Math.round(largest / RATIOS[ratio]),
    ...(asset.focus ? { style: { objectPosition: asset.focus } } : {}),
  }
}

export function creditUrl(credit: ImageCredit): string {
  return `https://unsplash.com/photos/${credit.slug}`
}

export function authorUrl(credit: ImageCredit): string {
  return `https://unsplash.com/@${credit.username}`
}
