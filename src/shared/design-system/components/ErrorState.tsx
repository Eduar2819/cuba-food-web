import { CircleAlert, RotateCw } from 'lucide-react'
import { Button } from './Button'
import { EmptyState } from './EmptyState'

export interface ErrorStateProps {
  title: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = 'Reintentar',
  className,
}: ErrorStateProps) {
  return (
    <EmptyState
      role="alert"
      tone="danger"
      icon={CircleAlert}
      title={title}
      description={description}
      className={className}
      action={
        onRetry && (
          <Button variant="secondary" leadingIcon={RotateCw} onClick={onRetry}>
            {retryLabel}
          </Button>
        )
      }
    />
  )
}
