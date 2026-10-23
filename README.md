# Sabor Cubano en Mérida

Guía informativa de los restaurantes cubanos en Mérida, Yucatán: cada restaurante con sus
platillos, redes sociales y ubicación. "Descubre Cuba en Mérida".

**Proyecto educativo, sin fines comerciales.** No hay planes de pago, promociones ni
calificaciones: el sitio solo informa.

> **Datos demo.** Todos los restaurantes, direcciones, teléfonos, horarios, redes y eventos
> son ficticios y están marcados con
> `isDemo: true` (teléfonos `999 000 …`, redes en `example.com`, direcciones "Calle Demo").
> No corresponden a negocios reales. Las fotos son de stock e ilustrativas.

## Stack

- React 19 + TypeScript (`strict`) + Vite 8
- React Router 7 (cada ruta es su propio chunk)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `@theme`)
- lucide-react (iconos, trazo 1.5), Leaflet + react-leaflet + OpenStreetMap (mapa, sin API key)
- Fuentes autoalojadas: Fraunces (titulares) y Figtree (OFL), `font-display: swap` + preload
- ESLint + Prettier, Vitest + Testing Library + jsdom

## Scripts

| Script              | Qué hace                                                |
| ------------------- | ------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo                                  |
| `npm run build`     | Typecheck + build (genera `sitemap.xml` y `robots.txt`) |
| `npm run preview`   | Sirve el build localmente                               |
| `npm run lint`      | ESLint (incluye las reglas de arquitectura)             |
| `npm run typecheck` | TypeScript sin emitir                                   |
| `npm test`          | Vitest (una pasada)                                     |
| `npm run format`    | Prettier sobre todo el proyecto                         |

Variables de entorno: ver `.env.example` (`VITE_SITE_URL`).

## Estructura (Screaming Architecture)

```
src/
  app/              # router, providers, layouts, páginas compuestas (inicio, contacto, 404)
  features/
    restaurants/    # directorio, perfil, tarjeta, estado abierto/cerrado, horarios, galería
    menu/           # menú estructurado | PDF | imagen | URL
    search/         # búsqueda global + índice local
    filters/        # filtros del directorio ↔ query params
    map/            # MapAdapter (abstracción) + implementación Leaflet
    dishes/         # "¿Qué se te antoja?", /platillos
    zones/          # Mérida y sus colonias (filtro "colonia" del directorio)
    nearby/         # geolocalización + distancia (Cerca de ti)
    events/  blog/  favorites/
    seo/            # <Seo>, JSON-LD, sitemap
  shared/
    design-system/  # tokens, estilos base y primitivas (ver /design-system en dev)
    lib/            # utilidades puras: fechas, geo, texto, imágenes, contacto
    hooks/
  data/             # mocks tipados (demo) y catálogo de imágenes con créditos
vite/               # plugins: preload del LCP y archivos SEO
```

Cada feature tiene `components/`, `hooks/`, `services/`, `pages/`, `types.ts` e `index.ts` público.
Reglas verificadas por ESLint (`no-restricted-imports`):

- Una feature solo importa otra desde su `index.ts` (`@/features/<feature>`).
- `shared` nunca importa de `features` ni de `app`.
- Excepción: `app/router` importa `features/*/pages/*` directamente (un chunk por ruta).

La lógica de negocio es pura y está probada: `getOpenStatus`, filtros y orden, índice de
búsqueda, sitemap, JSON-LD, distancia (Haversine).

## Datos y contratos para producción

- **Repositorios async** (`restaurantRepository.getAll()`, `getBySlug()`…) leen mocks con
  latencia simulada. Para conectar una API basta con implementar la misma interfaz.
- **Favoritos**: `favoritesStore` (localStorage) con interfaz reemplazable por API + auth.
- **Mapa**: `MapAdapter` permite cambiar Leaflet por otro proveedor vía `MapAdapterContext`.
- **Búsqueda**: `SearchEngine` local; preparado para un motor externo con la misma firma.
- **Imágenes**: `shared/lib/images.ts` genera `srcset` y formato automático (AVIF/WebP) sobre
  el CDN de Unsplash; cambiar de CDN es tocar un solo archivo.

## Herramientas de desarrollo

- `/design-system`: tokens y componentes en todos sus estados (solo en `dev`).
- `?ahora=2026-10-02T21:00`: fija la hora de Mérida para probar estados abierto/cerrado (solo `dev`).
- `localStorage.setItem('demo:fail', '1')`: fuerza errores de red para ver los estados de error.

## SEO

- Metadatos por página con las etiquetas nativas de React 19 (`<title>`, `<meta>`,
  `<link rel="canonical">`): title, description, Open Graph y Twitter/X cards.
- JSON-LD: `Restaurant` en cada perfil (sin `aggregateRating`: el sitio no tiene
  calificaciones), `Event`, `Article`, `BreadcrumbList` y `WebSite` con `SearchAction`.
- `sitemap.xml` y `robots.txt` se generan en el build a partir de los datos.

### Limitación de una SPA y propuesta

El HTML inicial es el mismo para todas las rutas y los metadatos se aplican al ejecutarse
JavaScript. Google renderiza JS, pero con demora; otros buscadores y los scrapers de redes
sociales (WhatsApp, Facebook, X) **no** lo ejecutan, así que al compartir un restaurante se
verían los metadatos genéricos de `index.html`.

Propuesta (no implementada, pendiente de aprobación): **prerender en build** de las rutas
públicas (inicio, directorio, perfiles, platillos, eventos y blog) usando los mismos
datos del sitemap, por ejemplo con el modo de prerender de React Router o un paso de SSG.
Así cada URL tendría su HTML con metadatos y JSON-LD sin cambiar la arquitectura. Cuando
exista una API, la alternativa es SSR o ISR.

## Accesibilidad y rendimiento

- WCAG AA: contraste validado en los tokens, foco visible, navegación por teclado (pestañas,
  radios, combobox de búsqueda, diálogos nativos), estados con icono + texto, áreas táctiles ≥ 44px.
- `prefers-reduced-motion` desactiva el parallax y las animaciones.
- Code splitting por ruta; Leaflet, el diálogo de búsqueda y el índice se descargan bajo demanda.
- LCP del inicio: imagen del hero con `fetchpriority="high"` y preload solo en `/`.

## Créditos

Fotografías de [Unsplash](https://unsplash.com) (licencia Unsplash). La lista completa con
autores está en `src/data/images.ts` y en la página `/creditos` del sitio. Mapas © colaboradores
de OpenStreetMap. Fuentes: Fraunces y Figtree (SIL Open Font License).
