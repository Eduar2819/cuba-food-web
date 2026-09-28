import { imageUrl, responsiveImage } from './images'
import type { ImageAsset } from './images'

const asset: ImageAsset = {
  photoId: 'photo-123',
  alt: 'Plato de ropa vieja',
  credit: { author: 'Autor', username: 'autor', slug: 'slug-123' },
}

describe('images', () => {
  it('construye URLs con formato automático y alto según proporción', () => {
    const url = new URL(imageUrl(asset, { width: 800, ratio: '4/3' }))
    expect(url.pathname).toBe('/photo-123')
    expect(url.searchParams.get('auto')).toBe('format')
    expect(url.searchParams.get('w')).toBe('800')
    expect(url.searchParams.get('h')).toBe('600')
  })

  it('genera srcset con cada ancho y dimensiones intrínsecas', () => {
    const props = responsiveImage(asset, { ratio: '16/9', widths: [400, 800], sizes: '50vw' })
    expect(props.srcSet.split(', ')).toHaveLength(2)
    expect(props.srcSet).toContain('800w')
    expect(props.sizes).toBe('50vw')
    expect(props.alt).toBe('Plato de ropa vieja')
    expect(props.width).toBe(800)
    expect(props.height).toBe(450)
  })
})
