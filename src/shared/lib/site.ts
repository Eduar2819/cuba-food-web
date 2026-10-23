/** Configuración pública del sitio. VITE_SITE_URL permite cambiar el dominio sin tocar código. */
export const SITE = {
  name: 'Sabor Cubano en Mérida',
  shortName: 'Sabor Cubano',
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://sabor-cubano.example',
  locale: 'es_MX',
  description:
    'Guía de restaurantes cubanos en Mérida, Yucatán: sus platillos, redes sociales y ubicación. Proyecto educativo.',
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString()
}
