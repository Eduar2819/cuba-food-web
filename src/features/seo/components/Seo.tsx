import { absoluteUrl, SITE } from '@/shared/lib/site'
import { imageUrl } from '@/shared/lib/images'
import type { ImageAsset } from '@/shared/lib/images'

export interface SeoProps {
  /** Título de la página (sin el sufijo del sitio). */
  title: string
  description: string
  /** Ruta canónica, p. ej. "/restaurantes/habana-1959". */
  path: string
  image?: ImageAsset
  type?: 'website' | 'article' | 'restaurant'
  noIndex?: boolean
  /** Uno o varios objetos Schema.org. */
  jsonLd?: object | object[]
}

/**
 * Metadatos con las etiquetas nativas de React 19: <title>, <meta> y <link>
 * se elevan al <head> automáticamente desde cualquier componente.
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noIndex,
  jsonLd,
}: SeoProps) {
  const fullTitle = path === '/' ? title : `${title} | ${SITE.shortName}`
  const canonical = absoluteUrl(path)
  const ogImage = image ? imageUrl(image, { width: 1200, ratio: '16/9' }) : undefined
  const ogType = type === 'restaurant' ? 'restaurant.restaurant' : type
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex" />}

      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content={SITE.locale} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {image && <meta property="og:image:alt" content={image.alt} />}

      <meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLdList.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON-LD: serialización segura (escapa "<" para no cerrar el script).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
