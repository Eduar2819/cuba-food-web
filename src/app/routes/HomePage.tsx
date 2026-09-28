import { useNow } from '@/shared/hooks/useNow'
import { absoluteUrl, SITE } from '@/shared/lib/site'
import { BlogHighlight } from '@/features/blog'
import { DishCravings } from '@/features/dishes'
import { UpcomingEvents } from '@/features/events'
import { ForRestaurantsCta } from '@/features/for-restaurants'
import { MapPreviewSection } from '@/features/map'
import { NearbySection } from '@/features/nearby'
import { PromotionsHighlight } from '@/features/promotions'
import { FeaturedRestaurants } from '@/features/restaurants'
import { Seo } from '@/features/seo'
import { ZonesBento } from '@/features/zones'
import { Hero } from './home/Hero'
import { HERO_BACKGROUND } from './home/heroImages'

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: SITE.url,
  inLanguage: 'es-MX',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${absoluteUrl('/restaurantes')}?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

/**
 * Landing: puerta de entrada a la guía. Cada sección responde una pregunta distinta
 * y usa una composición distinta (hero en capas, asimétrico, carrusel, bento, agenda,
 * tickets, editorial, banda fotográfica).
 */
export function HomePage() {
  const now = useNow()
  return (
    <>
      <Seo
        title="Sabor Cubano en Yucatán: restaurantes cubanos en Mérida, Progreso y Valladolid"
        description={SITE.description}
        path="/"
        image={HERO_BACKGROUND}
        jsonLd={websiteJsonLd}
      />
      <Hero />
      <FeaturedRestaurants now={now} />
      <DishCravings />
      <ZonesBento />
      <MapPreviewSection now={now} />
      <NearbySection now={now} />
      <UpcomingEvents now={now} />
      <PromotionsHighlight now={now} />
      <BlogHighlight />
      <ForRestaurantsCta />
    </>
  )
}
