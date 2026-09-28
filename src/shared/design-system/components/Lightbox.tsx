import { useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog } from './Dialog'
import { IconButton } from './IconButton'

export interface LightboxImage {
  src: string
  srcSet?: string
  alt: string
  caption?: string
}

export interface LightboxProps {
  images: LightboxImage[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  title?: string
}

export function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
  title = 'Galería',
}: LightboxProps) {
  const open = index !== null
  const current = index !== null ? images[index] : undefined
  const total = images.length

  const go = (delta: number) => {
    if (index === null) return
    onIndexChange((index + delta + total) % total)
  }

  useEffect(() => {
    if (index === null) return
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'ArrowRight') onIndexChange((index + 1) % total)
      if (event.key === 'ArrowLeft') onIndexChange((index - 1 + total) % total)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, total, onIndexChange])

  return (
    <Dialog open={open} onClose={onClose} title={title} hideTitle placement="fullscreen">
      {current && (
        <figure className="flex h-dvh flex-col items-center justify-center gap-4 px-4 pt-20 pb-6 tablet:px-24">
          <img
            src={current.src}
            srcSet={current.srcSet}
            sizes="100vw"
            alt={current.alt}
            className="max-h-[76dvh] w-auto max-w-full rounded-lg object-contain"
          />
          <figcaption className="flex flex-col items-center gap-1 text-center">
            {current.caption && (
              <span className="text-small text-arena-100">{current.caption}</span>
            )}
            <span className="text-caption text-arena-300" aria-live="polite">
              Foto {(index ?? 0) + 1} de {total}
            </span>
          </figcaption>
        </figure>
      )}
      {total > 1 && (
        <>
          <IconButton
            icon={ChevronLeft}
            label="Foto anterior"
            variant="overlay"
            size="lg"
            onClick={() => go(-1)}
            className="absolute top-1/2 left-3 -translate-y-1/2 tablet:left-6"
          />
          <IconButton
            icon={ChevronRight}
            label="Foto siguiente"
            variant="overlay"
            size="lg"
            onClick={() => go(1)}
            className="absolute top-1/2 right-3 -translate-y-1/2 tablet:right-6"
          />
        </>
      )}
    </Dialog>
  )
}
