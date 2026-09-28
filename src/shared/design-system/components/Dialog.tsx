import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { IconButton } from './IconButton'

export type DialogPlacement = 'center' | 'right' | 'bottom' | 'sheet' | 'fullscreen'

export interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  hideTitle?: boolean
  description?: string
  children: ReactNode
  footer?: ReactNode
  /**
   * center: diálogo modal · right: drawer lateral · bottom: bottom sheet
   * sheet: bottom sheet en móvil y drawer lateral desde tablet · fullscreen: lightbox
   */
  placement?: DialogPlacement
  className?: string
  bodyClassName?: string
}

const placements: Record<DialogPlacement, string> = {
  center:
    'm-auto w-[min(100%-2rem,34rem)] max-h-[min(90dvh,48rem)] rounded-xl ' +
    'starting:open:scale-96 starting:open:opacity-0',
  right:
    'ml-auto mr-0 my-0 h-dvh max-h-dvh w-[min(100%,28rem)] rounded-l-xl ' +
    'starting:open:translate-x-8 starting:open:opacity-0',
  bottom:
    'mx-0 mb-0 mt-auto w-full max-w-none max-h-[88dvh] rounded-t-xl ' +
    'starting:open:translate-y-8 starting:open:opacity-0',
  sheet:
    'mx-0 mb-0 mt-auto w-full max-w-none max-h-[88dvh] rounded-t-xl ' +
    'starting:open:translate-y-8 starting:open:opacity-0 ' +
    'tablet:my-0 tablet:mr-0 tablet:ml-auto tablet:h-dvh tablet:max-h-dvh tablet:w-[min(100%,28rem)] tablet:rounded-none tablet:rounded-l-xl ' +
    'tablet:starting:open:translate-x-8 tablet:starting:open:translate-y-0',
  fullscreen:
    'm-0 h-dvh max-h-none w-screen max-w-none rounded-none bg-anil-975 text-arena-50 ' +
    'starting:open:opacity-0',
}

/**
 * Diálogo sobre <dialog> nativo: foco atrapado, Escape y capa superior gratis.
 * Drawer, BottomSheet y Lightbox se construyen sobre este componente.
 */
export function Dialog({
  open,
  onClose,
  title,
  hideTitle,
  description,
  children,
  footer,
  placement = 'center',
  className,
  bodyClassName,
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      document.documentElement.style.overflow = 'hidden'
    } else if (!open && dialog.open) {
      dialog.close()
    }
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  const isFullscreen = placement === 'fullscreen'

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        // Clic en el backdrop (fuera del contenido) cierra.
        if (event.target === event.currentTarget) onClose()
      }}
      className={cn(
        'fixed inset-0 overflow-hidden bg-surface p-0 text-ink shadow-high',
        'transition-[opacity,translate,scale,display,overlay] transition-discrete duration-(--dur-normal) ease-out-soft',
        'backdrop:bg-scrim backdrop:transition-opacity backdrop:duration-(--dur-normal) starting:open:backdrop:opacity-0',
        placements[placement],
        className,
      )}
    >
      <div className="flex h-full max-h-[inherit] flex-col">
        <header
          className={cn(
            'flex shrink-0 items-start justify-between gap-4 px-5 pt-5 tablet:px-6 tablet:pt-6',
            isFullscreen && 'absolute inset-x-0 top-0 z-(--z-raised) pb-4',
          )}
        >
          <div className={cn('min-w-0', hideTitle && 'sr-only')}>
            <h2 id={titleId} className="text-h3 font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="mt-1 text-small text-ink-muted">
                {description}
              </p>
            )}
          </div>
          <IconButton
            icon={X}
            label="Cerrar"
            variant={isFullscreen ? 'overlay' : 'subtle'}
            onClick={onClose}
            className="-mt-1 -mr-1 ml-auto"
          />
        </header>
        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto overscroll-contain',
            !isFullscreen && 'px-5 py-5 tablet:px-6',
            bodyClassName,
          )}
        >
          {children}
        </div>
        {footer && (
          <footer className="shrink-0 border-t border-line bg-surface px-5 py-4 tablet:px-6">
            {footer}
          </footer>
        )}
      </div>
    </dialog>
  )
}
