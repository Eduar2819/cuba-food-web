import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ErrorState } from '@/shared/design-system'
import { NotFoundPage } from './NotFoundPage'

/** errorElement de las rutas: 404 o error inesperado (p. ej. fallo al cargar un chunk). */
export function RouteErrorPage() {
  const error = useRouteError()
  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />
  return (
    <div className="container-page py-16">
      <title>Algo salió mal | Sabor Cubano</title>
      <ErrorState
        title="No pudimos cargar esta página."
        description="Revisa tu conexión y vuelve a intentarlo."
        onRetry={() => window.location.reload()}
        retryLabel="Recargar página"
      />
    </div>
  )
}
