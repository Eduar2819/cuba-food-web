import { Link } from 'react-router'
import { Logo } from '@/shared/design-system'
import { SECTION_GROUPS } from '@/app/navigation'

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-surface-sunken">
      <div className="container-page grid gap-12 py-14 desktop:grid-cols-[1.4fr_2fr] desktop:py-20">
        <div className="flex max-w-sm flex-col gap-4">
          <Logo />
          <p className="text-small text-ink-muted">
            La guía de la gastronomía cubana en Yucatán: restaurantes, platillos, eventos y
            promociones en Mérida, Progreso y Valladolid.
          </p>
          <p className="text-caption text-ink-muted">
            Prototipo conceptual. Restaurantes, direcciones, teléfonos, horarios y calificaciones
            son datos de demostración.
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
                      className="inline-flex min-h-9 items-center text-small text-ink-muted underline-offset-4 hover:text-ink hover:underline"
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
        <p>© {new Date().getFullYear()} Sabor Cubano en Yucatán</p>
        <Link to="/creditos" className="underline-offset-4 hover:text-ink hover:underline">
          Créditos de fotografía
        </Link>
      </div>
    </footer>
  )
}
