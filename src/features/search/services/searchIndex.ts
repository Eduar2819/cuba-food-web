import { normalizeText, tokenize } from '@/shared/lib/text'
import type { ImageAsset } from '@/shared/lib/images'

export type SearchKind = 'restaurante' | 'platillo' | 'categoria' | 'zona'

/** Campo indexado con peso: el nombre pesa más que la descripción. */
export interface SearchField {
  text: string
  weight: number
}

export interface SearchDocument {
  id: string
  kind: SearchKind
  title: string
  subtitle?: string
  /** Destino al elegir el resultado. */
  href: string
  image?: ImageAsset
  fields: SearchField[]
}

export interface SearchResult {
  doc: SearchDocument
  score: number
}

interface IndexedField {
  weight: number
  normalized: string
  tokens: string[]
}

interface IndexedDocument {
  doc: SearchDocument
  fields: IndexedField[]
}

/**
 * Contrato de búsqueda. Hoy: índice local en memoria. Preparado para una búsqueda
 * avanzada (API, Meilisearch, Algolia…) con la misma firma.
 */
export interface SearchEngine {
  search(query: string, options?: { kinds?: SearchKind[]; limit?: number }): SearchResult[]
}

/** Puntuación de un token de la consulta contra un campo. */
function tokenScore(queryToken: string, field: IndexedField): number {
  let best = 0
  for (const token of field.tokens) {
    if (token === queryToken) best = Math.max(best, 3)
    else if (token.startsWith(queryToken)) best = Math.max(best, 2)
    else if (queryToken.length >= 4 && token.includes(queryToken)) best = Math.max(best, 1)
    // Tolerancia mínima a plural/singular: "tostones" ~ "toston", "croquetas" ~ "croqueta".
    else if (
      queryToken.length >= 4 &&
      queryToken.replace(/(es|s)$/, '') === token.replace(/(es|s)$/, '')
    )
      best = Math.max(best, 2)
  }
  return best * field.weight
}

export function createSearchIndex(documents: SearchDocument[]): SearchEngine {
  const indexed: IndexedDocument[] = documents.map((doc) => ({
    doc,
    fields: doc.fields.map((f) => ({
      weight: f.weight,
      normalized: normalizeText(f.text),
      tokens: tokenize(f.text),
    })),
  }))

  return {
    search(query, { kinds, limit = 50 } = {}) {
      const normalizedQuery = normalizeText(query)
      const queryTokens = tokenize(query)
      if (queryTokens.length === 0) return []

      const results: SearchResult[] = []
      for (const { doc, fields } of indexed) {
        if (kinds && !kinds.includes(doc.kind)) continue
        let score = 0
        let allTokensMatch = true
        for (const queryToken of queryTokens) {
          const best = Math.max(0, ...fields.map((f) => tokenScore(queryToken, f)))
          if (best === 0) {
            allTokensMatch = false
            break
          }
          score += best
        }
        if (!allTokensMatch) continue
        // Bonus por frase completa ("ropa vieja" dentro del nombre).
        for (const field of fields) {
          if (field.normalized === normalizedQuery) score += 10 * field.weight
          else if (normalizedQuery.includes(' ') && field.normalized.includes(normalizedQuery))
            score += 4 * field.weight
        }
        results.push({ doc, score })
      }
      return results
        .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
        .slice(0, limit)
    },
  }
}
