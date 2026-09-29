import { Link } from 'react-router'
import { MapPinOff } from 'lucide-react'
import { buttonStyles, EmptyState } from '@/shared/design-system'
import { Seo } from '@/features/seo'

export function NotFoundPage({
  title = 'No encontramos esta página.',
  description = 'Puede que el enlace esté mal escrito o que la página ya no exista.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="container-page py-16">
      <Seo title="Página no encontrada" description={description} path="/404" noIndex />
      <EmptyState
        icon={MapPinOff}
        headingLevel="h1"
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/restaurantes" className={buttonStyles({ variant: 'primary' })}>
              Explorar restaurantes
            </Link>
            <Link to="/" className={buttonStyles({ variant: 'ghost' })}>
              Ir al inicio
            </Link>
          </div>
        }
      />
    </div>
  )
}
