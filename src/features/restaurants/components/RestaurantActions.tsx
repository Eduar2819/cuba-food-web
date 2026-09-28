import { BookOpen, Heart, MessageCircle, Navigation, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { buttonStyles, ButtonContent, ShareButton, useToast } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { FavoriteButton, useFavorites } from '@/features/favorites'
import { contactLinks } from '../services/contactLinks'
import type { Restaurant } from '../types'

/** Acciones principales en desktop/tablet, bajo el encabezado del perfil. */
export function RestaurantActions({
  restaurant: r,
  shareUrl,
}: {
  restaurant: Restaurant
  shareUrl: string
}) {
  const links = contactLinks(r)
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={links.directions}
        target="_blank"
        rel="noreferrer"
        className={buttonStyles({ variant: 'primary' })}
      >
        <ButtonContent leadingIcon={Navigation}>Cómo llegar</ButtonContent>
      </a>
      {links.whatsapp && (
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noreferrer"
          className={buttonStyles({ variant: 'secondary' })}
        >
          <ButtonContent leadingIcon={MessageCircle}>WhatsApp</ButtonContent>
        </a>
      )}
      {links.phone && (
        <a href={links.phone} className={buttonStyles({ variant: 'ghost' })}>
          <ButtonContent leadingIcon={Phone}>Llamar</ButtonContent>
        </a>
      )}
      <FavoriteButton restaurantId={r.id} restaurantName={r.name} appearance="button" />
      <ShareButton title={r.name} text={`${r.name}: ${r.tagline}`} url={shareUrl} />
    </div>
  )
}

function BarItem({
  icon: Icon,
  label,
  href,
  onClick,
  external,
  active,
}: {
  icon: LucideIcon
  label: string
  href?: string
  onClick?: () => void
  external?: boolean
  active?: boolean
}) {
  const className = cn(
    'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-caption font-semibold',
    active ? 'text-accent-text' : 'text-ink',
  )
  const content = (
    <>
      <Icon aria-hidden size={20} fill={active ? 'currentColor' : 'none'} />
      {label}
    </>
  )
  return href ? (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {content}
    </a>
  ) : (
    <button type="button" onClick={onClick} className={className} aria-pressed={active}>
      {content}
    </button>
  )
}

/** Barra sticky del perfil en móvil: Cómo llegar, Llamar, WhatsApp, Menú, Guardar. */
export function MobileActionBar({ restaurant: r }: { restaurant: Restaurant }) {
  const links = contactLinks(r)
  const { isFavorite, toggle } = useFavorites()
  const toast = useToast()
  const saved = isFavorite(r.id)
  return (
    <nav
      aria-label={`Acciones rápidas de ${r.name}`}
      className="fixed inset-x-3 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-(--z-sticky) rounded-full bg-surface/95 px-2 shadow-high ring-1 ring-line backdrop-blur-lg tablet:hidden"
    >
      <div className="flex">
        <BarItem icon={Navigation} label="Llegar" href={links.directions} external />
        {links.phone && <BarItem icon={Phone} label="Llamar" href={links.phone} />}
        {links.whatsapp && (
          <BarItem icon={MessageCircle} label="WhatsApp" href={links.whatsapp} external />
        )}
        <BarItem icon={BookOpen} label="Menú" href="#menu" />
        <BarItem
          icon={Heart}
          label={saved ? 'Guardado' : 'Guardar'}
          active={saved}
          onClick={async () => {
            const now = await toggle(r.id)
            toast.show({
              message: now ? `${r.name}: guardado en favoritos` : `${r.name}: quitado de favoritos`,
              tone: now ? 'success' : 'neutral',
            })
          }}
        />
      </div>
    </nav>
  )
}
