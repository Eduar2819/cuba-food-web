import { Link } from 'react-router'
import { Logo } from '@/shared/design-system'
import { SECTION_GROUPS } from '@/app/navigation'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-surface-sunken">
      {/* Franja de losa hidráulica: el "piso" de la página */}
      <div aria-hidden className="ornament-losa h-10 text-line-strong [--losa-size:40px]" />
      <div className="container-page grid gap-12 pt-12 pb-14 desktop:grid-cols-[1.4fr_2fr] desktop:pt-16 desktop:pb-20">
        <div className="flex max-w-sm flex-col gap-4">
          <Logo />
          <p className="font-display text-h3 font-medium text-ink">
            La cocina cubana de Mérida, <em className="text-accent-text">en un solo lugar</em>.
          </p>
          <p className="text-small text-ink-muted">
            Guía informativa de los restaurantes cubanos en Mérida: sus platillos, redes sociales y
            ubicación.
          </p>
          <p className="text-caption text-ink-muted">
            Proyecto educativo sin fines comerciales. Restaurantes, direcciones, teléfonos y
            horarios son datos de demostración.
          </p>
        </div>
        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-8 tablet:grid-cols-3">
          {SECTION_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <p className="text-small font-semibold text-ink">{group.title}</p>
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex min-h-11 min-w-11 items-center text-small text-ink-muted underline-offset-4 hover:text-ink hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-line py-6 text-caption text-ink-muted tablet:flex-row tablet:justify-between">
        <p>© {new Date().getFullYear()} Sabor Cubano en Mérida</p>
        <Link
          to="/creditos"
          className="inline-flex min-h-11 items-center underline-offset-4 hover:text-ink hover:underline"
        >
          Créditos de fotografía
        </Link>
      </div>
    </footer>
  )
}
