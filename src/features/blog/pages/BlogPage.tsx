import { Link } from 'react-router'
import { ErrorState, PageHeader, Photo, Skeleton } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { formatISODate } from '@/shared/lib/dates'
import { responsiveImage } from '@/shared/lib/images'
import { Seo } from '@/features/seo'
import { BLOG_CATEGORY_LABEL } from '../services/blogFormat'
import { blogRepository } from '../services/blogRepository'
import type { BlogPost } from '../types'

function PostCard({ post, lead = false }: { post: BlogPost; lead?: boolean }) {
  return (
    <article className="group relative flex flex-col gap-3">
      <Photo
        {...responsiveImage(post.cover, {
          ratio: lead ? '16/9' : '3/2',
          sizes: lead ? '(min-width: 1024px) 66vw, 100vw' : '(min-width: 1024px) 33vw, 100vw',
        })}
        ratio={lead ? '16/9' : '3/2'}
        zoomOnHover
      />
      <p className="text-caption text-ink-muted">
        <span className="font-semibold text-accent-text">{BLOG_CATEGORY_LABEL[post.category]}</span>{' '}
        · {post.readingMinutes} min de lectura
      </p>
      <h2 className={lead ? 'text-h1 font-bold text-ink' : 'text-h3 font-semibold text-ink'}>
        <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
          {post.title}
        </Link>
      </h2>
      <p className="max-w-prose text-body text-ink-muted">{post.excerpt}</p>
      <p className="text-caption text-ink-muted">
        <time dateTime={post.publishedAt}>{formatISODate(post.publishedAt)}</time>
      </p>
    </article>
  )
}

export function BlogPage() {
  const posts = useAsync(() => blogRepository.getAll(), [])
  const [lead, ...rest] = posts.data ?? []
  return (
    <div className="container-page pb-8">
      <Seo
        title="Blog: guía cultural de la cocina cubana"
        description="Historias y guías sobre la comida cubana en Mérida: sándwich cubano, ropa vieja, congrí y más."
        path="/blog"
      />
      <PageHeader
        title="Guía cultural"
        description="Historias detrás de los platillos cubanos y guías para disfrutarlos en Mérida."
      />
      {posts.status === 'loading' && (
        <div aria-hidden className="grid gap-8 desktop:grid-cols-3">
          <Skeleton className="aspect-video rounded-lg desktop:col-span-2" />
          <Skeleton className="aspect-[3/2] rounded-lg" />
        </div>
      )}
      {posts.status === 'error' && (
        <ErrorState title="No pudimos cargar los artículos." onRetry={posts.reload} />
      )}
      {lead && (
        <div className="flex flex-col gap-16">
          <div className="max-w-5xl">
            <PostCard post={lead} lead />
          </div>
          <ul className="grid gap-x-8 gap-y-14 tablet:grid-cols-2 desktop:grid-cols-3">
            {rest.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
