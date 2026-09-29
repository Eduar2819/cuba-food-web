import { useState } from 'react'
import { Link } from 'react-router'
import { ExternalLink, FileText, Leaf, Flame, Sparkles, ThumbsUp, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge, buttonStyles, ButtonContent, Lightbox, Photo, Tabs } from '@/shared/design-system'
import type { BadgeTone } from '@/shared/design-system'
import { formatISODate } from '@/shared/lib/dates'
import { responsiveImage } from '@/shared/lib/images'
import type { Menu, MenuCategory, MenuItemTag } from '../types'

const currency = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
})

const TAGS: Record<MenuItemTag, { label: string; icon: LucideIcon; tone: BadgeTone }> = {
  recomendado: { label: 'Recomendado', icon: ThumbsUp, tone: 'accent' },
  vegetariano: { label: 'Vegetariano', icon: Leaf, tone: 'open' },
  picante: { label: 'Picante', icon: Flame, tone: 'soon' },
  nuevo: { label: 'Nuevo', icon: Sparkles, tone: 'brand' },
  'para-compartir': { label: 'Para compartir', icon: Users, tone: 'neutral' },
}

function CategoryItems({
  category,
  dishSlug,
}: {
  category: MenuCategory
  dishSlug: (id: string) => string | undefined
}) {
  return (
    <div className="flex flex-col gap-4">
      {category.description && <p className="text-small text-ink-muted">{category.description}</p>}
      <ul className="flex flex-col divide-y divide-line">
        {category.items.map((item) => {
          const slug = item.dishId ? dishSlug(item.dishId) : undefined
          return (
            <li key={item.id} className="flex items-start justify-between gap-6 py-4 first:pt-0">
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="text-body font-semibold text-ink">{item.name}</p>
                {item.description && (
                  <p className="text-small text-ink-muted">{item.description}</p>
                )}
                {(item.tags?.length || slug) && (
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {item.tags?.map((tag) => (
                      <Badge key={tag} tone={TAGS[tag].tone} icon={TAGS[tag].icon}>
                        {TAGS[tag].label}
                      </Badge>
                    ))}
                    {slug && (
                      <Link
                        to={`/platillos/${slug}`}
                        className="inline-flex min-h-11 items-center text-caption font-semibold text-accent-text underline-offset-4 hover:underline"
                      >
                        Qué es este platillo
                      </Link>
                    )}
                  </div>
                )}
              </div>
              <p className="shrink-0 font-display text-body font-semibold text-ink tabular-nums">
                {currency.format(item.price)}
              </p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

interface MenuViewProps {
  menu: Menu | null
  restaurantName: string
  /** Traduce dishId → slug del catálogo (lo inyecta quien compone, sin acoplar features). */
  dishSlug?: (dishId: string) => string | undefined
}

/** Menú en sus cuatro formatos: estructurado, PDF, imagen o enlace externo. */
export function MenuView({ menu, restaurantName, dishSlug = () => undefined }: MenuViewProps) {
  const [photo, setPhoto] = useState<number | null>(null)

  if (!menu) {
    return <p className="text-body text-ink-muted">{restaurantName} todavía no publica su menú.</p>
  }

  const updated = (
    <p className="text-caption text-ink-muted">
      Menú actualizado el {formatISODate(menu.updatedAt)}. Precios de demostración.
    </p>
  )

  if (menu.type === 'structured') {
    return (
      <div className="flex flex-col gap-4">
        <Tabs
          label={`Categorías del menú de ${restaurantName}`}
          items={menu.categories.map((category) => ({
            id: category.id,
            label: category.name,
            content: <CategoryItems category={category} dishSlug={dishSlug} />,
          }))}
        />
        {updated}
      </div>
    )
  }

  if (menu.type === 'pdf' || menu.type === 'url') {
    const isPdf = menu.type === 'pdf'
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-start gap-4 rounded-lg bg-surface-sunken p-6 tablet:flex-row tablet:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
            {isPdf ? <FileText aria-hidden size={22} /> : <ExternalLink aria-hidden size={22} />}
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-body font-semibold text-ink">{menu.label}</p>
            <p className="text-small text-ink-muted">
              {isPdf
                ? 'Se abre en una pestaña nueva.'
                : 'El restaurante publica su menú en su propio sitio.'}
            </p>
          </div>
          <a
            href={menu.url}
            target="_blank"
            rel="noreferrer"
            className={buttonStyles({ variant: 'secondary' })}
          >
            <ButtonContent>{isPdf ? 'Abrir menú (PDF)' : 'Ver menú'}</ButtonContent>
          </a>
        </div>
        {updated}
      </div>
    )
  }

  const images = menu.images.map((image) => {
    const r = responsiveImage(image, { ratio: '3/4', sizes: '100vw' })
    return { src: r.src, srcSet: r.srcSet, alt: image.alt }
  })
  return (
    <div className="flex flex-col gap-3">
      <ul className="grid grid-cols-2 gap-3 tablet:grid-cols-3">
        {menu.images.map((image, i) => (
          <li key={image.photoId}>
            <button
              type="button"
              onClick={() => setPhoto(i)}
              aria-label={`Ampliar: ${image.alt}`}
              className="group block w-full rounded-lg"
            >
              <Photo
                {...responsiveImage(image, { ratio: '3/4', sizes: '33vw' })}
                ratio="3/4"
                zoomOnHover
              />
            </button>
          </li>
        ))}
      </ul>
      {updated}
      <Lightbox
        title={`Menú de ${restaurantName}`}
        images={images}
        index={photo}
        onIndexChange={setPhoto}
        onClose={() => setPhoto(null)}
      />
    </div>
  )
}
