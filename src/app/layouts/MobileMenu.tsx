import { NavLink } from 'react-router'
import { Drawer } from '@/shared/design-system'
import { cn } from '@/shared/lib/cn'
import { SECTION_GROUPS } from '@/app/navigation'

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Drawer side="right" open={open} onClose={onClose} title="Menú">
      <nav aria-label="Secciones" className="flex flex-col gap-8">
        {SECTION_GROUPS.map((group) => (
          <div key={group.title} className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-caption font-semibold text-ink-muted">{group.title}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-12 items-center rounded-md px-3 font-display text-h3 font-semibold',
                        isActive
                          ? 'bg-surface-sunken text-ink'
                          : 'text-ink hover:bg-surface-sunken',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Drawer>
  )
}
