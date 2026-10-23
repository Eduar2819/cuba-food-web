import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { Heart, Menu, Search } from 'lucide-react'
import { IconButton, Logo } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { useSearchDialog } from '@/features/search'
import { PRIMARY_NAV } from '@/app/navigation'
import { MobileMenu } from './MobileMenu'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative inline-flex min-h-11 items-center rounded-full px-4 text-small font-semibold transition-colors duration-(--dur-micro) ease-out-soft',
    isActive ? 'bg-surface-sunken text-ink' : 'text-ink-muted hover:text-ink',
  )

/** Barra flotante (isla) separada del borde; blur solo aquí porque es fija. */
export function SiteHeader() {
  const search = useSearchDialog()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-(--z-nav) px-3 pt-3 tablet:px-4 desktop:px-6">
      <div
        className={cn(
          'mx-auto flex h-16 max-w-(--container-page) items-center gap-2 rounded-full pr-2 pl-4 tablet:pl-5',
          'bg-surface/85 shadow-low ring-1 ring-line backdrop-blur-lg backdrop-saturate-150',
        )}
      >
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded-full"
          aria-label="Sabor Cubano en Mérida, inicio"
        >
          <Logo />
        </Link>

        <nav aria-label="Principal" className="ml-4 hidden desktop:block large:ml-8">
          <ul className="flex items-center gap-1">
            {PRIMARY_NAV.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={navLinkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => search.open()}
            className={cn(
              'hidden min-h-11 items-center gap-2 rounded-full bg-surface-sunken pr-2 pl-4 text-small text-ink-muted large:inline-flex',
              'transition-colors duration-(--dur-micro) ease-out-soft hover:bg-line hover:text-ink',
            )}
          >
            <Search aria-hidden size={18} />
            <span className="pr-6">Buscar</span>
            <kbd className="rounded-sm bg-surface px-2 py-0.5 font-sans text-caption text-ink-muted ring-1 ring-line">
              /
            </kbd>
          </button>
          <IconButton
            icon={Search}
            label="Buscar"
            onClick={() => search.open()}
            className="large:hidden"
          />
          <NavLink
            to="/favoritos"
            aria-label="Favoritos"
            title="Favoritos"
            className={({ isActive }) =>
              cn(
                'hidden size-11 items-center justify-center rounded-full transition-colors hover:bg-surface-sunken desktop:inline-flex',
                isActive ? 'text-accent-text' : 'text-ink',
              )
            }
          >
            <Heart aria-hidden size={20} />
          </NavLink>
          <IconButton
            icon={Menu}
            label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="desktop:hidden"
            aria-expanded={menuOpen}
          />
        </div>
      </div>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  )
}
