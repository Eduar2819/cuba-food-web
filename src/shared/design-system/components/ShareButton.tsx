import { useState } from 'react'
import { Copy, ExternalLink, MessageCircle, Share2 } from 'lucide-react'
import { shareLinks } from '@/shared/lib/contact'
import { Button } from './Button'
import { Dialog } from './Dialog'
import { IconButton } from './IconButton'
import type { IconButtonProps } from './IconButton'
import { useToast } from './toastContext'

export interface ShareButtonProps {
  title: string
  text: string
  url: string
  appearance?: 'icon' | 'button'
  variant?: IconButtonProps['variant']
  className?: string
}

/**
 * Compartir: Web Share API cuando existe (móvil); si no, diálogo con
 * WhatsApp, Facebook, X y Copiar enlace.
 */
export function ShareButton({
  title,
  text,
  url,
  appearance = 'button',
  variant = 'subtle',
  className,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const links = shareLinks(url, text)

  const share = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url })
        return
      } catch (error) {
        // El usuario canceló: no se abre el respaldo.
        if (error instanceof DOMException && error.name === 'AbortError') return
      }
    }
    setOpen(true)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.show({ message: 'Enlace copiado', tone: 'success' })
      setOpen(false)
    } catch {
      toast.show({
        message: 'No pudimos copiar el enlace. Cópialo desde la barra de direcciones.',
        tone: 'danger',
      })
    }
  }

  const external =
    'flex min-h-12 items-center gap-3 rounded-md px-3 text-body font-semibold text-ink hover:bg-surface-sunken'

  return (
    <>
      {appearance === 'icon' ? (
        <IconButton
          icon={Share2}
          label="Compartir"
          variant={variant}
          onClick={share}
          className={className}
        />
      ) : (
        <Button variant="ghost" leadingIcon={Share2} onClick={share} className={className}>
          Compartir
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} title="Compartir" description={title}>
        <ul className="flex flex-col gap-1">
          <li>
            <a className={external} href={links.whatsapp} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden size={20} className="text-status-open" />
              WhatsApp
            </a>
          </li>
          <li>
            <a className={external} href={links.facebook} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden size={20} className="text-ink-muted" />
              Facebook
            </a>
          </li>
          <li>
            <a className={external} href={links.x} target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden size={20} className="text-ink-muted" />X
            </a>
          </li>
        </ul>
        <div className="mt-4 flex gap-2 border-t border-line pt-4">
          <input
            readOnly
            value={url}
            aria-label="Enlace para compartir"
            onFocus={(event) => event.currentTarget.select()}
            className="min-h-11 min-w-0 flex-1 rounded-md bg-surface-sunken px-3 text-small text-ink-muted"
          />
          <Button variant="secondary" leadingIcon={Copy} onClick={copy}>
            Copiar enlace
          </Button>
        </div>
      </Dialog>
    </>
  )
}
