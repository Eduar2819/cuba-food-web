import { PageHeader } from '@/shared/design-system'
import { authorUrl, creditUrl } from '@/shared/lib/images'
import { IMAGES } from '@/data/images'
import { Seo } from '@/features/seo'

const photos = Object.values(IMAGES).filter((asset) => !asset.localSrc)

export function CreditsPage() {
  return (
    <div className="container-page">
      <Seo
        title="Créditos de fotografía"
        description="Fotografías de Unsplash usadas en el prototipo y sus autores."
        path="/creditos"
      />
      <PageHeader
        title="Créditos de fotografía"
        description="Las fotos son de Unsplash (licencia Unsplash) y son ilustrativas: no retratan a los restaurantes demo."
      />
      <ul className="grid gap-x-8 gap-y-3 pb-8 tablet:grid-cols-2 desktop:grid-cols-3">
        {photos.map((asset) => (
          <li key={asset.photoId} className="text-small">
            <a
              href={creditUrl(asset.credit)}
              target="_blank"
              rel="noreferrer"
              className="text-ink underline-offset-4 hover:underline"
            >
              {asset.alt}
            </a>
            <span className="text-ink-muted">
              {' '}
              por{' '}
              <a
                href={authorUrl(asset.credit)}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {asset.credit.author}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
