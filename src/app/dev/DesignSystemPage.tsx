import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  ArrowUpRight,
  Bike,
  Clock,
  Coffee,
  Heart,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  SearchX,
  Share2,
  ShoppingBag,
  Sparkles,
  WifiOff,
} from 'lucide-react'
import {
  Badge,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  Chip,
  Dialog,
  Drawer,
  EmptyState,
  ErrorState,
  IconButton,
  Input,
  Lightbox,
  Photo,
  Rating,
  Select,
  Skeleton,
  SkeletonText,
  Tabs,
  useToast,
} from '@/shared/design-system'
import { responsiveImage } from '@/shared/lib/images'
import { IMAGES } from '@/data/images'

const semanticColors = [
  'canvas',
  'surface',
  'surface-sunken',
  'surface-raised',
  'surface-inverse',
  'ink',
  'ink-muted',
  'line',
  'line-strong',
  'brand',
  'accent',
  'accent-soft',
  'accent-text',
  'highlight',
  'status-open',
  'status-soon',
  'status-closed',
  'danger',
  'focus',
]

const palettes: Record<string, string[]> = {
  Añil: ['50', '100', '200', '300', '500', '700', '800', '900', '950', '975'],
  Guayaba: ['100', '300', '500', '600', '700'],
  Mamoncillo: ['100', '400', '800'],
  Arena: ['50', '100', '200', '300', '400', '500', '600', '700', '800'],
  Palma: ['100', '400', '700'],
}

const paletteVar: Record<string, string> = {
  Añil: 'anil',
  Guayaba: 'guayaba',
  Mamoncillo: 'mamoncillo',
  Arena: 'arena',
  Palma: 'palma',
}

const typeScale = [
  ['display', 'font-display font-bold text-display', 'Descubre Cuba en Yucatán'],
  ['h1', 'font-display font-bold text-h1', 'Restaurantes cubanos'],
  ['h2', 'font-display font-bold text-h2', '¿Qué se te antoja?'],
  ['h3', 'font-display font-semibold text-h3', 'Horarios de hoy'],
  ['lead', 'text-lead', 'Encuentra restaurantes, sabores y experiencias cubanas cerca de ti.'],
  ['body', 'text-body', 'Ropa vieja, congrí y tostones preparados como en La Habana.'],
  ['small', 'text-small', 'Abierto hasta las 11:00 p. m.'],
  ['caption', 'text-caption', 'Datos de demostración'],
] as const

const galleryAssets = [IMAGES.platoCubano, IMAGES.sandwichCubano, IMAGES.flan, IMAGES.mojito]

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="flex flex-col gap-6 py-12">
      <h2 id={`${id}-title`} className="text-h2 font-bold">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-caption text-ink-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  )
}

export function DesignSystemPage() {
  const toast = useToast()
  const [dialog, setDialog] = useState<null | 'center' | 'drawer' | 'sheet' | 'bottom'>(null)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [chips, setChips] = useState<string[]>(['open'])
  const toggleChip = (id: string) =>
    setChips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))

  return (
    <div className="container-page pb-24">
      <title>Design System · Sabor Cubano (dev)</title>
      <header className="flex flex-col items-start gap-3 border-b border-line py-12">
        <Badge tone="demo">Solo desarrollo</Badge>
        <h1 className="text-display font-bold">Malecón</h1>
        <p className="max-w-prose text-lead text-ink-muted">
          Tokens y componentes base de Sabor Cubano en Yucatán. Las features solo componen estas
          piezas. Fuente de verdad: <code className="font-mono text-small">design-dna.json</code>.
        </p>
        <nav aria-label="Secciones" className="flex flex-wrap gap-2 pt-2">
          {[
            'color',
            'tipografia',
            'forma',
            'botones',
            'formularios',
            'contenido',
            'overlays',
            'estados',
          ].map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-small font-semibold text-accent-text underline-offset-4 hover:underline"
            >
              {id}
            </a>
          ))}
        </nav>
      </header>

      <Section id="color" title="Color">
        <Row label="Tokens semánticos (cambian en modo oscuro). Úsalos en features.">
          <div className="grid w-full grid-cols-2 gap-3 tablet:grid-cols-4 desktop:grid-cols-6">
            {semanticColors.map((name) => (
              <div key={name} className="flex flex-col gap-2">
                <div
                  className="h-16 rounded-md ring-1 ring-line ring-inset"
                  style={{ background: `var(--ds-${name})` }}
                />
                <code className="font-mono text-caption">{name}</code>
              </div>
            ))}
          </div>
        </Row>
        {Object.entries(palettes).map(([name, steps]) => (
          <Row key={name} label={`Paleta ${name}`}>
            <div className="flex w-full overflow-hidden rounded-md ring-1 ring-line">
              {steps.map((step) => (
                <div key={step} className="flex min-w-0 flex-1 flex-col">
                  <div
                    className="h-14"
                    style={{ background: `var(--color-${paletteVar[name]}-${step})` }}
                  />
                  <span className="truncate bg-surface px-1 py-1 text-center font-mono text-caption">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </Row>
        ))}
      </Section>

      <Section id="tipografia" title="Tipografía">
        <p className="text-small text-ink-muted">
          Bricolage Grotesque (titulares) · Figtree (UI y cuerpo). Autoalojadas, font-display: swap.
        </p>
        <div className="flex flex-col gap-5">
          {typeScale.map(([token, classes, sample]) => (
            <div
              key={token}
              className="grid gap-2 tablet:grid-cols-[8rem_1fr] tablet:items-baseline"
            >
              <code className="font-mono text-caption text-ink-muted">text-{token}</code>
              <p className={classes}>{sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="forma" title="Espaciado, radios, sombras y movimiento">
        <Row label="Espaciado (base 4px)">
          {[1, 2, 3, 4, 6, 8, 12, 16, 24, 32].map((n) => (
            <div key={n} className="flex flex-col items-center gap-1">
              <div
                className="bg-brand"
                style={{ width: `calc(var(--spacing) * ${n})`, height: 16 }}
              />
              <code className="font-mono text-caption">{n * 4}</code>
            </div>
          ))}
        </Row>
        <Row label="Radios: sm 8 · md 12 (controles) · lg 20 (media, paneles) · xl 28 (bisel) · full (interactivos)">
          {['rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-full'].map((r) => (
            <div
              key={r}
              className={`flex size-20 items-center justify-center bg-surface-sunken text-caption ${r}`}
            >
              {r.replace('rounded-', '')}
            </div>
          ))}
        </Row>
        <Row label="Sombras tintadas en Añil">
          {['shadow-low', 'shadow-medium', 'shadow-high', 'shadow-bezel'].map((s) => (
            <div
              key={s}
              className={`flex h-20 w-36 items-center justify-center rounded-lg bg-surface text-caption ${s}`}
            >
              {s.replace('shadow-', '')}
            </div>
          ))}
        </Row>
        <Row label="Movimiento: ease-out-soft / ease-spring · 160 / 280 / 640 ms (pasa el cursor)">
          {['ease-out-soft', 'ease-spring'].map((e) => (
            <div
              key={e}
              className="group flex w-56 items-center rounded-full bg-surface-sunken p-1"
            >
              <span
                className={`size-8 rounded-full bg-accent transition-transform duration-(--dur-macro) group-hover:translate-x-44 ${e}`}
              />
              <code className="sr-only">{e}</code>
            </div>
          ))}
        </Row>
      </Section>

      <Section id="botones" title="Botones">
        <Row label="Variantes">
          <Button>Ver restaurante</Button>
          <Button variant="secondary">Cómo llegar</Button>
          <Button variant="ghost">Ver menú</Button>
          <Button variant="subtle">Compartir</Button>
        </Row>
        <Row label="Tamaños · con iconos · botón isla (CTA principal)">
          <Button size="sm">Pequeño</Button>
          <Button size="md" leadingIcon={Navigation}>
            Cómo llegar
          </Button>
          <Button size="lg" trailingIcon={ArrowUpRight}>
            Explorar restaurantes
          </Button>
        </Row>
        <Row label="Estados">
          <Button disabled>Deshabilitado</Button>
          <Button loading>Guardando</Button>
          <Button variant="secondary" loading>
            Cargando
          </Button>
        </Row>
        <Row label="Sobre fotografía">
          <div className="relative w-full overflow-hidden rounded-lg">
            <Photo
              {...responsiveImage(IMAGES.habanaArco, { ratio: '21/9', sizes: '100vw' })}
              ratio="21/9"
              rounded={false}
            />
            <div className="absolute inset-0 flex flex-wrap items-end gap-3 bg-linear-to-t from-anil-975/70 to-transparent p-5">
              <Button variant="overlay" leadingIcon={Heart}>
                Guardar
              </Button>
              <Chip tone="onPhoto" icon={Clock}>
                Abierto ahora
              </Chip>
              <IconButton icon={Share2} label="Compartir" variant="overlay" />
            </div>
          </div>
        </Row>
        <Row label="IconButton">
          <IconButton icon={Heart} label="Guardar" />
          <IconButton icon={Heart} label="Guardado" variant="subtle" filled />
          <IconButton icon={Phone} label="Llamar" variant="solid" />
          <IconButton icon={Share2} label="Compartir" variant="accent" />
          <IconButton icon={MapPin} label="Ver en mapa" size="lg" variant="subtle" />
          <IconButton icon={Heart} label="Deshabilitado" disabled />
        </Row>
      </Section>

      <Section id="formularios" title="Formularios y selección">
        <div className="grid gap-6 tablet:grid-cols-2">
          <Input label="Buscar" placeholder="Restaurante, platillo o zona" leadingIcon={Search} />
          <Input
            label="Correo"
            type="email"
            hint="Solo para responderte."
            placeholder="tu@correo.com"
          />
          <Input label="Teléfono" error="Escribe 10 dígitos." defaultValue="999 00" />
          <Input label="Deshabilitado" disabled placeholder="No disponible" />
          <Select
            label="Zona"
            placeholder="Todas las zonas"
            options={[
              { value: 'merida', label: 'Mérida' },
              { value: 'progreso', label: 'Progreso' },
              { value: 'valladolid', label: 'Valladolid' },
            ]}
          />
          <Select
            label="Ordenar por"
            options={[
              { value: 'relevancia', label: 'Relevancia' },
              { value: 'distancia', label: 'Distancia' },
            ]}
            error="Activa tu ubicación para ordenar por distancia."
          />
        </div>
        <Row label="Checkbox">
          <Checkbox label="Delivery" />
          <Checkbox label="Para llevar" defaultChecked />
          <Checkbox
            label="Estacionamiento"
            description="Solo muestra lugares con estacionamiento propio."
          />
          <Checkbox label="No disponible" disabled />
        </Row>
        <Row label="Chips (toggle, aria-pressed)">
          {[
            { id: 'near', label: 'Cerca de mí', icon: LocateFixed },
            { id: 'open', label: 'Abierto ahora', icon: Clock },
            { id: 'cafe', label: 'Cafeterías', icon: Coffee },
            { id: 'delivery', label: 'Delivery', icon: Bike },
            { id: 'takeout', label: 'Para llevar', icon: ShoppingBag },
          ].map((chip) => (
            <Chip
              key={chip.id}
              icon={chip.icon}
              selected={chips.includes(chip.id)}
              onClick={() => toggleChip(chip.id)}
            >
              {chip.label}
            </Chip>
          ))}
        </Row>
      </Section>

      <Section id="contenido" title="Contenido">
        <Row label="Badge">
          <Badge tone="open" icon={Clock}>
            Abierto
          </Badge>
          <Badge tone="soon" icon={Clock}>
            Cierra pronto
          </Badge>
          <Badge tone="closed" icon={Clock}>
            Cerrado
          </Badge>
          <Badge tone="accent">Promoción</Badge>
          <Badge tone="highlight" icon={Sparkles}>
            Destacado
          </Badge>
          <Badge tone="brand">Nuevo</Badge>
          <Badge>$$</Badge>
          <Badge tone="demo">Demo</Badge>
        </Row>
        <Row label="Rating (solo lectura, accesible como texto)">
          <Rating value={4.5} count={12} />
          <Rating value={3.8} size="md" />
          <Rating value={5} showValue={false} />
        </Row>
        <Row label="Card: plain · outlined · raised · sunken · bezel (doble bisel, piezas protagonistas)">
          <div className="grid w-full gap-4 tablet:grid-cols-2 desktop:grid-cols-5">
            {(['plain', 'outlined', 'raised', 'sunken', 'bezel'] as const).map((v) => (
              <Card key={v} variant={v}>
                <p className="font-display text-h3 font-semibold">{v}</p>
                <p className="text-small text-ink-muted">Contenido de ejemplo.</p>
              </Card>
            ))}
          </div>
        </Row>
        <Row label="Photo: proporción fija, lazy, srcset (clic para abrir Lightbox)">
          <div className="grid w-full grid-cols-2 gap-3 desktop:grid-cols-4">
            {galleryAssets.map((asset, i) => (
              <button
                key={asset.photoId}
                type="button"
                className="group rounded-lg text-left"
                onClick={() => setLightbox(i)}
                aria-label={`Abrir foto: ${asset.alt}`}
              >
                <Photo
                  {...responsiveImage(asset, {
                    ratio: '4/3',
                    sizes: '(min-width: 1024px) 25vw, 50vw',
                  })}
                  ratio="4/3"
                  zoomOnHover
                />
              </button>
            ))}
          </div>
        </Row>
        <Row label="Tabs (flechas, Home, End)">
          <Tabs
            className="w-full"
            label="Secciones del restaurante"
            items={[
              {
                id: 'menu',
                label: 'Menú',
                content: <p className="text-small">Platos fuertes, entradas y postres.</p>,
              },
              {
                id: 'horarios',
                label: 'Horarios',
                content: <p className="text-small">Lunes a domingo.</p>,
              },
              {
                id: 'fotos',
                label: 'Fotos',
                content: <p className="text-small">Galería del lugar.</p>,
              },
            ]}
          />
        </Row>
        <Row label="Skeleton (con la forma del contenido final)">
          <div className="grid w-full gap-4 tablet:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="aspect-[4/3] w-full rounded-lg" />
                <Skeleton className="h-5 w-2/3" />
                <SkeletonText lines={2} />
              </div>
            ))}
          </div>
        </Row>
      </Section>

      <Section id="overlays" title="Diálogos, drawer, bottom sheet y toast">
        <Row label="Basados en <dialog> nativo: foco atrapado, Escape y clic fuera cierran">
          <Button variant="ghost" onClick={() => setDialog('center')}>
            Abrir diálogo
          </Button>
          <Button variant="ghost" onClick={() => setDialog('drawer')}>
            Abrir drawer
          </Button>
          <Button variant="ghost" onClick={() => setDialog('sheet')}>
            Filtros (responsive)
          </Button>
          <Button variant="ghost" onClick={() => setDialog('bottom')}>
            Bottom sheet
          </Button>
        </Row>
        <Row label="Toast (aria-live)">
          <Button
            variant="subtle"
            onClick={() => toast.show({ message: 'Guardado en favoritos', tone: 'success' })}
          >
            Toast de éxito
          </Button>
          <Button variant="subtle" onClick={() => toast.show('Enlace copiado')}>
            Toast neutral
          </Button>
          <Button
            variant="subtle"
            onClick={() => toast.show({ message: 'No pudimos copiar el enlace', tone: 'danger' })}
          >
            Toast de error
          </Button>
        </Row>
      </Section>

      <Section id="estados" title="Estados vacíos y de error">
        <div className="grid gap-4 desktop:grid-cols-3">
          <EmptyState
            icon={SearchX}
            title="No encontramos restaurantes con estos filtros."
            description="Prueba con otra zona o quita el filtro de horario."
            action={<Button variant="secondary">Limpiar filtros</Button>}
          />
          <ErrorState
            title="No pudimos cargar los restaurantes."
            description="Revisa tu conexión."
            onRetry={() => toast.show('Reintentando')}
          />
          <EmptyState
            icon={WifiOff}
            title="Estás sin conexión."
            description="Mostramos lo último que cargaste. Algunos datos pueden no estar al día."
          />
        </div>
      </Section>

      <Dialog
        open={dialog === 'center'}
        onClose={() => setDialog(null)}
        title="Compartir restaurante"
        description="Elige cómo compartir Habana 1959."
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancelar
            </Button>
            <Button onClick={() => setDialog(null)}>Copiar enlace</Button>
          </div>
        }
      >
        <p className="text-small text-ink-muted">Contenido del diálogo.</p>
      </Dialog>
      <Drawer
        side="right"
        open={dialog === 'drawer'}
        onClose={() => setDialog(null)}
        title="Drawer lateral"
      >
        <p className="text-small text-ink-muted">Panel lateral para desktop.</p>
      </Drawer>
      <Drawer
        open={dialog === 'sheet'}
        onClose={() => setDialog(null)}
        title="Filtros"
        footer={
          <Button fullWidth onClick={() => setDialog(null)}>
            Ver 12 restaurantes
          </Button>
        }
      >
        <div className="flex flex-col">
          <Checkbox label="Abierto ahora" />
          <Checkbox label="Delivery" />
          <Checkbox label="Para llevar" />
        </div>
      </Drawer>
      <BottomSheet open={dialog === 'bottom'} onClose={() => setDialog(null)} title="Bottom sheet">
        <p className="text-small text-ink-muted">Siempre desde abajo.</p>
      </BottomSheet>
      <Lightbox
        images={galleryAssets.map((asset) => {
          const r = responsiveImage(asset, { ratio: '3/2', sizes: '100vw' })
          return { src: r.src, srcSet: r.srcSet, alt: asset.alt, caption: asset.alt }
        })}
        index={lightbox}
        onIndexChange={setLightbox}
        onClose={() => setLightbox(null)}
      />
    </div>
  )
}
