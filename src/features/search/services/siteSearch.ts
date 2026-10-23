import {
  cuisineName,
  cuisines,
  restaurantRepository,
  restaurantTypes,
  serviceLabel,
  typeLabel,
} from '@/features/restaurants'
import type { Restaurant } from '@/features/restaurants'
import { dishCategories, dishRepository } from '@/features/dishes'
import type { Dish, DishCategory } from '@/features/dishes'
import { cityName, neighborhoodName, zoneRepository } from '@/features/zones'
import type { City, Neighborhood } from '@/features/zones'
import { directoryUrl } from '@/features/filters'
import { createSearchIndex } from './searchIndex'
import type { SearchDocument, SearchEngine } from './searchIndex'

export interface SearchCorpus {
  restaurants: Restaurant[]
  dishes: Dish[]
  dishCategories: DishCategory[]
  cities: City[]
  neighborhoods: Neighborhood[]
}

/** Construye los documentos del índice a partir de los datos (función pura, testeable). */
export function buildSearchDocuments(corpus: SearchCorpus): SearchDocument[] {
  const dishName = new Map(corpus.dishes.map((d) => [d.id, d.name]))
  const categoryName = new Map(corpus.dishCategories.map((c) => [c.id, c.name]))

  const restaurants: SearchDocument[] = corpus.restaurants.map((r) => ({
    id: `restaurante:${r.id}`,
    kind: 'restaurante',
    title: r.name,
    subtitle: `${typeLabel(r.type)} en ${neighborhoodName(r.address.neighborhoodId)}, ${cityName(r.address.cityId)}`,
    href: `/restaurantes/${r.slug}`,
    image: r.cover,
    fields: [
      { text: r.name, weight: 5 },
      { text: typeLabel(r.type), weight: 2 },
      { text: r.cuisineIds.map(cuisineName).join(' '), weight: 2 },
      { text: r.dishIds.map((id) => dishName.get(id) ?? '').join(' '), weight: 2 },
      {
        text: `${neighborhoodName(r.address.neighborhoodId)} ${cityName(r.address.cityId)}`,
        weight: 2,
      },
      { text: r.serviceIds.map(serviceLabel).join(' '), weight: 1 },
      { text: `${r.tagline} ${r.description}`, weight: 0.5 },
    ],
  }))

  const dishes: SearchDocument[] = corpus.dishes.map((d) => ({
    id: `platillo:${d.id}`,
    kind: 'platillo',
    title: d.name,
    subtitle: d.summary,
    href: `/platillos/${d.slug}`,
    image: d.image,
    fields: [
      { text: d.name, weight: 5 },
      { text: d.keywords.join(' '), weight: 3 },
      { text: categoryName.get(d.categoryId) ?? '', weight: 1.5 },
      { text: d.summary, weight: 1 },
    ],
  }))

  const categories: SearchDocument[] = [
    ...restaurantTypes.map((t) => ({
      id: `categoria:tipo:${t.id}`,
      kind: 'categoria' as const,
      title: t.plural,
      subtitle: 'Tipo de lugar',
      href: directoryUrl({ tipos: [t.id] }),
      fields: [{ text: `${t.label} ${t.plural}`, weight: 4 }],
    })),
    ...cuisines.map((c) => ({
      id: `categoria:cocina:${c.id}`,
      kind: 'categoria' as const,
      title: c.name,
      subtitle: 'Tipo de cocina',
      href: directoryUrl({ q: c.name }),
      fields: [{ text: c.name, weight: 3 }],
    })),
    ...corpus.dishCategories.map((c) => ({
      id: `categoria:platillos:${c.id}`,
      kind: 'categoria' as const,
      title: c.name,
      subtitle: 'Categoría de platillos',
      href: `/platillos#${c.slug}`,
      fields: [{ text: c.name, weight: 3 }],
    })),
  ]

  const zones: SearchDocument[] = [
    ...corpus.neighborhoods.map((n) => {
      const city = corpus.cities.find((c) => c.id === n.cityId)
      return {
        id: `zona:${n.id}`,
        kind: 'zona' as const,
        title: n.name,
        subtitle: `Colonia de ${city?.name ?? ''}`,
        href: directoryUrl({ zona: n.slug }),
        fields: [
          { text: n.name, weight: 5 },
          { text: city?.name ?? '', weight: 1 },
        ],
      }
    }),
  ]

  return [...restaurants, ...dishes, ...categories, ...zones]
}

let enginePromise: Promise<SearchEngine> | null = null

/** Índice global, construido una sola vez y reutilizado (se precarga al abrir la búsqueda). */
export function loadSearchEngine(): Promise<SearchEngine> {
  enginePromise ??= Promise.all([
    restaurantRepository.getAll(),
    dishRepository.getAll(),
    zoneRepository.getCities(),
    zoneRepository.getNeighborhoods(),
  ])
    .then(([restaurants, dishes, cities, neighborhoods]) =>
      createSearchIndex(
        buildSearchDocuments({ restaurants, dishes, dishCategories, cities, neighborhoods }),
      ),
    )
    .catch((error: unknown) => {
      enginePromise = null // permite reintentar
      throw error
    })
  return enginePromise
}
