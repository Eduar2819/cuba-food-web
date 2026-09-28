# Sabor Cubano en Yucatán

Directorio gastronómico de restaurantes cubanos en Yucatán: guía, buscador, mapa y guía cultural.

> **Prototipo conceptual con datos demo.** Todos los restaurantes, direcciones, teléfonos, horarios,
> ratings y redes sociales son ficticios y están marcados con `isDemo: true`. No corresponden a
> negocios reales.

## Stack

- React 19 + TypeScript (`strict`) + Vite
- React Router (rutas con carga diferida)
- Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `@theme`)
- lucide-react (iconos), Leaflet + react-leaflet + OpenStreetMap (mapa)
- Fuentes autoalojadas vía Fontsource (Bricolage Grotesque, Figtree)
- ESLint + Prettier, Vitest + Testing Library + jsdom

## Scripts

| Script              | Qué hace                        |
| ------------------- | ------------------------------- |
| `npm run dev`       | Servidor de desarrollo          |
| `npm run build`     | Typecheck + build de producción |
| `npm run preview`   | Sirve el build localmente       |
| `npm run lint`      | ESLint                          |
| `npm run typecheck` | TypeScript sin emitir           |
| `npm test`          | Vitest (una pasada)             |
| `npm run format`    | Prettier sobre todo el proyecto |

## Estructura (Screaming Architecture)

```
src/
  app/            # router, providers, layouts, estilos globales, entry
  features/       # una carpeta por capacidad de negocio
    restaurants/ menu/ search/ filters/ map/ dishes/ zones/ nearby/
    events/ promotions/ blog/ favorites/ for-restaurants/ seo/
  shared/
    design-system/  # tokens, primitivas, componentes base
    lib/            # utilidades puras
    hooks/
  data/             # mocks tipados (demo)
```

Reglas (verificadas por ESLint con `no-restricted-imports`):

- Una feature solo importa otra desde su `index.ts` público (`@/features/<feature>`).
- `shared` nunca importa de `features` ni de `app`.
- La lógica de negocio vive en funciones puras testeables.

Alias: `@/` → `src/`.
