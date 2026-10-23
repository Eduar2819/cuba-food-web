import { cn } from '@/shared/lib/cn'

/* Piezas gráficas del hero (decorativas, aria-hidden). Paths generados una sola vez. */

const PALM_LEAFLETS =
  'M27.6 156Q58.5 160 88.9 153.6Q58.1 149.6 27.6 156ZM27.6 156Q18.3 126.3 -0.3 101.4Q9 131.1 27.6 156ZM35.6 142.8Q67.9 147.3 100 141.6Q67.7 137.1 35.6 142.8ZM35.6 142.8Q27.5 111.3 9.9 83.8Q18.1 115.3 35.6 142.8ZM44.1 130.2Q77.3 135.4 110.5 130.6Q77.3 125.4 44.1 130.2ZM44.1 130.2Q37.4 97.3 21.4 67.7Q28 100.7 44.1 130.2ZM52.9 118.2Q86.5 124.1 120.5 120.2Q86.8 114.3 52.9 118.2ZM52.9 118.2Q48.1 84.3 34 53.2Q38.7 87 52.9 118.2ZM62.1 106.8Q95.7 113.5 129.9 110.6Q96.3 103.9 62.1 106.8ZM62.1 106.8Q59.4 72.5 47.5 40.4Q50.1 74.6 62.1 106.8ZM71.7 95.9Q104.8 103.4 138.8 101.6Q105.6 94.1 71.7 95.9ZM71.7 95.9Q71.3 61.9 61.7 29.3Q62.1 63.3 71.7 95.9ZM81.7 85.7Q113.9 93.9 147.1 93.1Q114.9 84.9 81.7 85.7ZM81.7 85.7Q83.6 52.5 76.4 20.1Q74.5 53.2 81.7 85.7ZM92 76.1Q122.8 84.9 154.8 85.1Q124.1 76.2 92 76.1ZM92 76.1Q96.2 44.3 91.4 12.6Q87.3 44.4 92 76.1ZM102.8 67Q131.7 76.4 162.1 77.3Q133.2 67.9 102.8 67ZM102.8 67Q109 37.2 106.5 6.9Q100.4 36.7 102.8 67ZM114 58.5Q140.6 68.3 169 69.9Q142.3 60.1 114 58.5ZM114 58.5Q121.8 31.3 121.4 2.9Q113.5 30.2 114 58.5ZM125.6 50.7Q149.6 60.6 175.5 62.6Q151.5 52.7 125.6 50.7ZM125.6 50.7Q134.7 26.4 135.9 0.4Q126.7 24.7 125.6 50.7ZM137.5 43.4Q158.7 53.2 181.8 55.4Q160.7 45.6 137.5 43.4ZM137.5 43.4Q147.6 22.4 149.9 -0.8Q139.9 20.2 137.5 43.4ZM149.9 36.7Q167.9 46.2 188.1 48.3Q170.1 38.8 149.9 36.7ZM149.9 36.7Q160.2 19.2 163.3 -0.8Q153 16.6 149.9 36.7ZM162.7 30.6Q177.3 39.5 194.3 41.3Q179.7 32.4 162.7 30.6ZM162.7 30.6Q172.8 16.8 176.1 0Q165.9 13.8 162.7 30.6ZM175.8 25.1Q187 33.1 200.7 34.3Q189.5 26.3 175.8 25.1ZM175.8 25.1Q185.2 15 188.1 1.6Q178.8 11.7 175.8 25.1Z'
const PALM_STEM = 'M10 190Q70 60 190 20'

/** Hoja de palma estilizada: tallo curvo con foliolos. Hereda currentColor. */
export function PalmFrond({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="-10 0 210 200" className={cn('pointer-events-none', className)}>
      <path d={PALM_LEAFLETS} fill="currentColor" />
      <path d={PALM_STEM} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Trazo de pincel para subrayar a mano. */
export function Swoosh({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 24"
      fill="none"
      className={cn('pointer-events-none', className)}
    >
      <path
        d="M4 19C52 8 118 3 196 6"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Tres rayitas de brillo (acompañan a una nota manuscrita). */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      className={cn('pointer-events-none', className)}
    >
      <path
        d="M12 2v6M20 6l-4 4M22 14h-6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}
