import type { ImgHTMLAttributes } from 'react'
import { cn } from '@/shared/lib/cn'

export type PhotoRatio = '1/1' | '4/3' | '3/2' | '16/9' | '3/4' | '4/5' | '21/9'

const ratios: Record<PhotoRatio, string> = {
  '1/1': 'aspect-square',
  '4/3': 'aspect-[4/3]',
  '3/2': 'aspect-[3/2]',
  '16/9': 'aspect-video',
  '3/4': 'aspect-[3/4]',
  '4/5': 'aspect-[4/5]',
  '21/9': 'aspect-[21/9]',
}

export interface PhotoProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> {
  alt: string
  ratio?: PhotoRatio
  /** Imagen LCP: sin lazy y con fetchpriority alto. */
  priority?: boolean
  /** Escala suave al hover del ancestro con clase `group`. */
  zoomOnHover?: boolean
  rounded?: boolean
  frameClassName?: string
}

/** Imagen con marco de proporción fija (evita CLS), lazy por defecto. */
export function Photo({
  alt,
  ratio = '4/3',
  priority = false,
  zoomOnHover = false,
  rounded = true,
  className,
  frameClassName,
  ...rest
}: PhotoProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-surface-sunken',
        ratios[ratio],
        rounded && 'rounded-lg',
        frameClassName,
      )}
    >
      <img
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn(
          'absolute inset-0 size-full object-cover',
          zoomOnHover &&
            'transition-transform duration-(--dur-macro) ease-out-soft group-hover:scale-[1.03]',
          className,
        )}
        {...rest}
      />
    </div>
  )
}
