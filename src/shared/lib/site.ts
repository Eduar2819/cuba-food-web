/** Configuración pública del sitio. VITE_SITE_URL permite cambiar el dominio sin tocar código. */
export const SITE = {
  name: 'Sabor Cubano en Yucatán',
  shortName: 'Sabor Cubano',
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://sabor-cubano.example',
  locale: 'es_MX',
  description:
    'Directorio de restaurantes cubanos en Yucatán: encuentra dónde comer ropa vieja, sándwich cubano y café cubano en Mérida, Progreso y Valladolid.',
} as const

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString()
}
