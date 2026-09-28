/**
 * Normaliza texto para búsqueda: minúsculas, sin acentos ni diéresis (la ñ se conserva),
 * sin puntuación y con espacios colapsados. "Cafetería" → "cafeteria", "Mérida" → "merida".
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .split('ñ') // la ñ es letra propia en español: se conserva
    .map((part) => part.normalize('NFD').replace(/\p{M}/gu, ''))
    .join('ñ')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Palabras vacías del español que no aportan a la búsqueda. */
const STOPWORDS = new Set([
  'de',
  'del',
  'la',
  'las',
  'el',
  'los',
  'y',
  'en',
  'a',
  'con',
  'un',
  'una',
  'para',
])

export function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter((token) => token.length > 0 && !STOPWORDS.has(token))
}
