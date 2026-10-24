import { useEffect, useId, useRef, useState } from 'react'
import { BookOpen, Heart, MessageCircle, Navigation, Phone, Plus } from 'lucide-react'
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

interface QuickAction {
  key: string
  icon: LucideIcon
  label: string
  href?: string
  external?: boolean
  onClick?: () => void
  active?: boolean
}

/**
 * Acciones rápidas del perfil en móvil: botón flotante "+" que despliega Cómo llegar,
 * Llamar, WhatsApp, Menú y Guardar. Se cierra con el mismo botón, Escape, tocando fuera
 * o al elegir una opción. El foco va a la primera opción al abrir y vuelve al botón al cerrar.
 */
export function MobileActionBar({ restaurant: r }: { restaurant: Restaurant }) {
  const links = contactLinks(r)
  const { isFavorite, toggle } = useFavorites()
  const toast = useToast()
  const saved = isFavorite(r.id)
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const close = (returnFocus = true) => {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    listRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const actions: QuickAction[] = [
    {
      key: 'llegar',
      icon: Navigation,
      label: 'Cómo llegar',
      href: links.directions,
      external: true,
    },
    ...(links.phone ? [{ key: 'llamar', icon: Phone, label: 'Llamar', href: links.phone }] : []),
    ...(links.whatsapp
      ? [
          {
            key: 'whatsapp',
            icon: MessageCircle,
            label: 'WhatsApp',
            href: links.whatsapp,
            external: true,
          },
        ]
      : []),
    { key: 'menu', icon: BookOpen, label: 'Ver menú', href: '#menu' },
    {
      key: 'guardar',
      icon: Heart,
      label: saved ? 'Guardado' : 'Guardar',
      active: saved,
      onClick: async () => {
        const now = await toggle(r.id)
        toast.show({
          message: now ? `${r.name}: guardado en favoritos` : `${r.name}: quitado de favoritos`,
          tone: now ? 'success' : 'neutral',
        })
      },
    },
  ]

  const itemClass = (active?: boolean) =>
    cn(
      'flex min-h-12 items-center gap-3 rounded-full bg-surface py-2 pr-5 pl-2 text-small font-semibold shadow-medium ring-1 ring-line',
      'transition-[background-color,transform] duration-(--dur-micro) ease-out-soft active:scale-[0.97]',
      active ? 'text-accent-text' : 'text-ink',
    )

  return (
    <div className="tablet:hidden">
      {/* Velo: tocar fuera cierra */}
      <div
        aria-hidden
        onClick={() => close(false)}
        className={cn(
          'fixed inset-0 z-(--z-sticky) bg-anil-975/25 transition-opacity duration-(--dur-normal) ease-out-soft',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <nav
        aria-label={`Acciones rápidas de ${r.name}`}
        className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-(--z-sticky) flex flex-col items-end gap-3"
      >
        <ul id={menuId} ref={listRef} hidden={!open} className="flex flex-col items-end gap-2.5">
          {actions.map(({ key, icon: Icon, label, href, external, onClick, active }, i) => {
            const content = (
              <>
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-full',
                    active ? 'bg-accent-soft' : 'bg-surface-sunken',
                  )}
                >
                  <Icon aria-hidden size={18} fill={active ? 'currentColor' : 'none'} />
                </span>
                {label}
              </>
            )
            return (
              <li
                key={key}
                className="fab-item"
                style={{ animationDelay: `${(actions.length - 1 - i) * 40}ms` }}
              >
                {href ? (
                  <a
                    href={href}
                    onClick={() => close(false)}
                    className={itemClass(active)}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      onClick?.()
                      close()
                    }}
                    className={itemClass(active)}
                  >
                    {content}
                  </button>
                )}
              </li>
            )
          })}
        </ul>

        <button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Cerrar acciones rápidas' : 'Abrir acciones rápidas'}
          onClick={() => (open ? close() : setOpen(true))}
          className="grid size-14 place-items-center rounded-full bg-accent text-on-accent shadow-high ring-4 ring-canvas transition-[background-color,transform] duration-(--dur-micro) ease-out-soft hover:bg-accent-hover active:scale-95"
        >
          <Plus
            aria-hidden
            size={26}
            strokeWidth={2.25}
            className={cn(
              'transition-transform duration-(--dur-normal) ease-spring',
              open && 'rotate-45',
            )}
          />
        </button>
      </nav>
    </div>
  )
}
