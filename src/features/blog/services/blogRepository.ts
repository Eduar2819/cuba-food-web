import { BLOG_POSTS } from '@/data/blog'
import { mockResponse } from '@/shared/lib/mockApi'
import type { BlogPost } from '../types'

export interface BlogRepository {
  getAll(): Promise<BlogPost[]>
  getBySlug(slug: string): Promise<BlogPost | null>
}

const byDateDesc = (a: BlogPost, b: BlogPost) => b.publishedAt.localeCompare(a.publishedAt)

export const blogRepository: BlogRepository = {
  getAll: () => mockResponse([...BLOG_POSTS].sort(byDateDesc)),
  getBySlug: (slug) => mockResponse(BLOG_POSTS.find((p) => p.slug === slug) ?? null),
}

export const blogPosts = BLOG_POSTS
