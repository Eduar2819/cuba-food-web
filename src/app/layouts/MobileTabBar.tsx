import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { useSearchDialog } from '@/features/search'
import { MOBILE_TABS } from '@/app/navigation'

const itemClass =
  'group flex min-h-14 flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[0.75rem] leading-none font-semibold transition-colors duration-(--dur-micro) ease-out-soft active:scale-[0.96]'

/** Ícono con cápsula indicadora detrás cuando la pestaña está activa. */
function TabContent({
  icon: Icon,
  label,
  active,
  filled,
}: {
  icon: LucideIcon
  label: string
  active: boolean
  filled?: boolean
}) {
  return (
    <>
      <span
        className={cn(
          'grid h-8 w-14 place-items-center rounded-full transition-[background-color,transform] duration-(--dur-normal) ease-spring',
          active
            ? 'scale-100 bg-accent-soft text-accent-text'
            : 'scale-90 text-ink-muted group-hover:text-ink',
        )}
      >
        <Icon
          aria-hidden
          size={21}
          strokeWidth={active ? 2.25 : 1.75}
          fill={active && filled ? 'currentColor' : 'none'}
        />
      </span>
      <span className={active ? 'text-ink' : 'text-ink-muted'}>{label}</span>
    </>
  )
}

/**
 * Barra inferior móvil flotante: Inicio | Buscar | Mapa | Favoritos.
 * Misma piel que el encabezado (píldora translúcida con desenfoque) y separada del borde.
 */
export function MobileTabBar() {
  const search = useSearchDialog()
  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-(--z-nav) tablet:inset-x-4 desktop:hidden"
    >
      <ul className="mx-auto flex max-w-md rounded-full bg-surface/88 p-1 shadow-high ring-1 ring-line backdrop-blur-lg backdrop-saturate-150">
        {MOBILE_TABS.map(({ label, icon, to, action }) => (
          <li key={label} className="flex flex-1">
            {to ? (
              <NavLink to={to} end={to === '/'} className={itemClass}>
                {({ isActive }) => (
                  <TabContent
                    icon={icon}
                    label={label}
                    active={isActive}
                    filled={to === '/favoritos'}
                  />
                )}
              </NavLink>
            ) : (
              <button
                type="button"
                onClick={() => action === 'search' && search.open()}
                className={itemClass}
              >
                <TabContent icon={icon} label={label} active={search.isOpen} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
