import { useState } from 'react'
import { Images } from 'lucide-react'
import { Lightbox, Photo } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { responsiveImage } from '@/shared/lib/images'
import type { GalleryImage } from '../types'

/**
 * Galería del perfil: foto principal + cuadrícula (desktop) o tira horizontal (móvil),
 * todas abren el lightbox. La principal es la imagen LCP del perfil.
 */
export function RestaurantGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const [main, ...rest] = images
  if (!main) return null
  const grid = rest.slice(0, 4)
  const lightboxImages = images.map((g) => {
    const r = responsiveImage(g.image, { ratio: '3/2', sizes: '100vw' })
    return { src: r.src, srcSet: r.srcSet, alt: g.image.alt, caption: g.caption }
  })

  return (
    <section aria-label={`Fotos de ${name}`}>
      <div className="grid gap-2 tablet:h-[26rem] tablet:grid-cols-[2fr_1fr_1fr] tablet:grid-rows-2 desktop:h-[32rem]">
        <button
          type="button"
          onClick={() => setOpen(0)}
          aria-label={`Ver foto: ${main.image.alt}`}
          className="group block rounded-lg tablet:row-span-2 tablet:h-full"
        >
          <Photo
            {...responsiveImage(main.image, {
              ratio: '4/3',
              sizes: '(min-width: 768px) 50vw, 100vw',
            })}
            ratio="4/3"
            priority
            frameClassName="h-full tablet:aspect-auto"
            zoomOnHover
          />
        </button>
        <ul className="-mx-4 scrollbar-none flex snap-x gap-2 overflow-x-auto px-4 tablet:contents">
          {grid.map((g, i) => {
            const index = i + 1
            const isLast = i === grid.length - 1 && images.length > 5
            return (
              <li key={g.id} className="w-[40%] shrink-0 snap-start tablet:h-full tablet:w-auto">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  aria-label={`Ver foto: ${g.image.alt}`}
                  className="group relative block w-full rounded-lg tablet:h-full"
                >
                  <Photo
                    {...responsiveImage(g.image, {
                      ratio: '1/1',
                      sizes: '(min-width: 768px) 25vw, 40vw',
                      widths: [320, 480, 640],
                    })}
                    ratio="1/1"
                    frameClassName={cn('tablet:aspect-auto tablet:h-full')}
                    zoomOnHover
                  />
                  {isLast && (
                    <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-anil-975/55 text-small font-semibold text-arena-50">
                      +{images.length - 5} {images.length - 5 === 1 ? 'foto' : 'fotos'}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <button
        type="button"
        onClick={() => setOpen(0)}
        className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full text-small font-semibold text-accent-text underline-offset-4 hover:underline"
      >
        <Images aria-hidden size={18} />
        Ver las {images.length} fotos
      </button>
      <Lightbox
        title={`Fotos de ${name}`}
        images={lightboxImages}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
      />
    </section>
  )
}
