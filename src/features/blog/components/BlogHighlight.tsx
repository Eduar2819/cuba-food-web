import { Link } from 'react-router'
import { ErrorState, Photo, Section, Skeleton, textLinkClass } from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { formatISODate } from '@/shared/lib/dates'
import { responsiveImage } from '@/shared/lib/images'
import { blogRepository } from '../services/blogRepository'
import { BLOG_CATEGORY_LABEL } from '../services/blogFormat'

/** Blog en composición editorial: un artículo principal y una lista de lectura. */
export function BlogHighlight() {
  const posts = useAsync(() => blogRepository.getAll(), [])
  const [lead, ...others] = posts.data ?? []

  return (
    <Section
      title="Guía cultural"
      description="Historias detrás de los platillos y guías para comer cubano en Mérida."
      action={
        <Link to="/blog" className={textLinkClass}>
          Leer el blog
        </Link>
      }
    >
      {posts.status === 'loading' && (
        <div aria-hidden className="grid gap-8 desktop:grid-cols-12">
          <Skeleton className="aspect-video rounded-lg desktop:col-span-7" />
          <div className="flex flex-col gap-4 desktop:col-span-5">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>
      )}
      {posts.status === 'error' && (
        <ErrorState title="No pudimos cargar los artículos." onRetry={posts.reload} />
      )}
      {posts.status === 'success' && lead && (
        <div className="grid gap-10 desktop:grid-cols-12 desktop:gap-12">
          <article className="group relative flex flex-col gap-4 desktop:col-span-7">
            <Photo
              {...responsiveImage(lead.cover, {
                ratio: '16/9',
                sizes: '(min-width: 1024px) 56vw, 100vw',
              })}
              ratio="16/9"
              zoomOnHover
            />
            <p className="text-caption font-semibold text-accent-text">
              {BLOG_CATEGORY_LABEL[lead.category]}
            </p>
            <h3 className="text-h2 font-bold text-ink">
              <Link
                to={`/blog/${lead.slug}`}
                className="after:absolute after:inset-0 after:content-['']"
              >
                {lead.title}
              </Link>
            </h3>
            <p className="max-w-prose text-body text-ink-muted">{lead.excerpt}</p>
          </article>
          <ol className="flex flex-col gap-8 desktop:col-span-5">
            {others.slice(0, 4).map((post) => (
              <li key={post.id}>
                <article className="group relative flex flex-col gap-1.5">
                  <p className="text-caption text-ink-muted">
                    {BLOG_CATEGORY_LABEL[post.category]} · {post.readingMinutes} min de lectura
                  </p>
                  <h3 className="text-h3 font-semibold text-ink group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    <Link
                      to={`/blog/${post.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-small text-ink-muted">
                    <time dateTime={post.publishedAt}>{formatISODate(post.publishedAt)}</time>
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Section>
  )
}
