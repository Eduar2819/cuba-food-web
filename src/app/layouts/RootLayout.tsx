import { Outlet, ScrollRestoration, useNavigation } from 'react-router'
import { WifiOff } from 'lucide-react'
import { useOnlineStatus } from '@/shared/hooks/useOnlineStatus'
import { cn } from '@/shared/lib/cn'
import { SearchDialogProvider } from '@/features/search'
import { MobileTabBar } from './MobileTabBar'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

function RouteProgress() {
  const navigation = useNavigation()
  const busy = navigation.state !== 'idle'
  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-x-0 top-0 z-(--z-toast) h-0.5 origin-left bg-accent transition-[opacity,transform] duration-(--dur-macro) ease-out-soft',
        busy ? 'scale-x-75 opacity-100' : 'scale-x-100 opacity-0',
      )}
    />
  )
}

function OfflineBanner() {
  const online = useOnlineStatus()
  if (online) return null
  return (
    <div role="status" className="bg-surface-inverse text-ink-inverse">
      <p className="container-page flex items-center gap-2 py-2 text-small">
        <WifiOff aria-hidden size={16} />
        Estás sin conexión. Mostramos lo último que cargaste; algunos datos pueden no estar al día.
      </p>
    </div>
  )
}

export function RootLayout() {
  return (
    <SearchDialogProvider>
      <a
        href="#contenido"
        className="sr-only z-(--z-toast) rounded-full bg-brand px-4 py-3 text-on-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <RouteProgress />
      <OfflineBanner />
      <SiteHeader />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <SiteFooter />
      {/* Espacio para la barra inferior en móvil */}
      <div aria-hidden className="h-[calc(4.5rem+env(safe-area-inset-bottom))] desktop:hidden" />
      <MobileTabBar />
      <ScrollRestoration />
    </SearchDialogProvider>
  )
}
