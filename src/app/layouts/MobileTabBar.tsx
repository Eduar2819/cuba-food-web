import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { useSearchDialog } from '@/features/search'
import { MOBILE_TABS } from '@/app/navigation'

const itemClass = (active: boolean) =>
  cn(
    'flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-caption font-semibold',
    'transition-colors duration-(--dur-micro) ease-out-soft',
    active ? 'text-accent-text' : 'text-ink-muted',
  )

/** Barra inferior móvil: Inicio | Buscar | Mapa | Favoritos. */
export function MobileTabBar() {
  const search = useSearchDialog()
  return (
    <nav
      aria-label="Navegación inferior"
      className={cn(
        'fixed inset-x-0 bottom-0 z-(--z-nav) desktop:hidden',
        'bg-surface/92 pb-[env(safe-area-inset-bottom)] ring-1 ring-line backdrop-blur-lg',
      )}
    >
      <ul className="mx-auto flex max-w-lg">
        {MOBILE_TABS.map(({ label, icon: Icon, to, action }) => (
          <li key={label} className="flex flex-1">
            {to ? (
              <NavLink to={to} end={to === '/'} className={({ isActive }) => itemClass(isActive)}>
                {({ isActive }) => (
                  <>
                    <Icon
                      aria-hidden
                      size={22}
                      fill={isActive && to === '/favoritos' ? 'currentColor' : 'none'}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={() => action === 'search' && search.open()}
                className={itemClass(search.isOpen)}
              >
                <Icon aria-hidden size={22} />
                {label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
