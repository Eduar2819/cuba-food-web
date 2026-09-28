import type { ImageAsset } from '@/shared/lib/images'

export type BlogBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'quote'; text: string }

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  category: 'platillos' | 'guias' | 'cultura'
  cover: ImageAsset
  /** YYYY-MM-DD */
  publishedAt: string
  readingMinutes: number
  author: string
  body: BlogBlock[]
  relatedDishIds: string[]
}
