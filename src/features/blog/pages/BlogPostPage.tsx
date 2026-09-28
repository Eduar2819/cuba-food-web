import { Link, useParams } from 'react-router'
import { FileX } from 'lucide-react'
import {
  Breadcrumbs,
  buttonStyles,
  chipStyles,
  EmptyState,
  ErrorState,
  Photo,
  ShareButton,
  Skeleton,
  SkeletonText,
} from '@/shared/design-system'
import { useAsync } from '@/shared/hooks/useAsync'
import { formatISODate } from '@/shared/lib/dates'
import { responsiveImage } from '@/shared/lib/images'
import { absoluteUrl } from '@/shared/lib/site'
import { dishById } from '@/features/dishes'
import { articleJsonLd, breadcrumbJsonLd, Seo } from '@/features/seo'
import { BLOG_CATEGORY_LABEL } from '../services/blogFormat'
import { blogRepository } from '../services/blogRepository'
import type { BlogBlock } from '../types'

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case 'heading':
      return <h2 className="pt-4 text-h2 font-bold text-ink">{block.text}</h2>
    case 'quote':
      return (
        <blockquote className="border-l-4 border-accent py-1 pl-5 font-display text-h3 font-semibold text-ink">
          {block.text}
        </blockquote>
      )
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List
          className={`flex flex-col gap-2 pl-6 ${block.ordered ? 'list-decimal' : 'list-disc'} marker:text-accent-text`}
        >
          {block.items.map((item) => (
            <li key={item} className="pl-1">
              {item}
            </li>
          ))}
        </List>
      )
    }
    default:
      return <p>{block.text}</p>
  }
}

export function BlogPostPage() {
  const { slug = '' } = useParams()
  const data = useAsync(
    () => Promise.all([blogRepository.getBySlug(slug), blogRepository.getAll()]),
    [slug],
  )

  if (data.status === 'loading')
    return (
      <div aria-hidden className="container-page flex max-w-3xl flex-col gap-6 pt-10">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="aspect-video rounded-lg" />
        <SkeletonText lines={6} />
      </div>
    )
  if (data.status === 'error')
    return (
      <div className="container-page py-12">
        <ErrorState title="No pudimos cargar el artículo." onRetry={data.reload} />
      </div>
    )

  const [post, all] = data.data
  if (!post)
    return (
      <div className="container-page py-12">
        <title>Artículo no encontrado | Sabor Cubano</title>
        <EmptyState
          icon={FileX}
          title="No encontramos este artículo."
          action={
            <Link to="/blog" className={buttonStyles({ variant: 'secondary' })}>
              Ir al blog
            </Link>
          }
        />
      </div>
    )

  const path = `/blog/${post.slug}`
  const others = all.filter((p) => p.id !== post.id).slice(0, 3)
  const dishes = post.relatedDishIds.map(dishById).filter((d) => d !== undefined)

  return (
    <article className="container-page pt-6 pb-10">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={path}
        image={post.cover}
        type="article"
        jsonLd={[
          articleJsonLd(post),
          breadcrumbJsonLd([
            { name: 'Blog', path: '/blog' },
            { name: post.title, path },
          ]),
        ]}
      />
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Breadcrumbs
          items={[
            {
              label: 'Blog',
              link: (
                <Link to="/blog" className="hover:text-ink hover:underline">
                  Blog
                </Link>
              ),
            },
            { label: post.title },
          ]}
        />
        <header className="flex flex-col gap-4">
          <p className="text-small text-ink-muted">
            <span className="font-semibold text-accent-text">
              {BLOG_CATEGORY_LABEL[post.category]}
            </span>{' '}
            · {post.readingMinutes} min de lectura
          </p>
          <h1 className="text-h1 font-bold text-ink">{post.title}</h1>
          <p className="text-lead text-ink-muted">{post.excerpt}</p>
          <p className="text-small text-ink-muted">
            {post.author} ·{' '}
            <time dateTime={post.publishedAt}>{formatISODate(post.publishedAt)}</time>
          </p>
        </header>
      </div>
      <div className="mx-auto mt-8 max-w-5xl">
        <Photo
          {...responsiveImage(post.cover, {
            ratio: '16/9',
            sizes: '(min-width: 1024px) 64rem, 100vw',
          })}
          ratio="16/9"
          priority
          frameClassName="rounded-xl"
        />
      </div>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-5 text-[1.125rem] leading-[1.75] text-ink">
        {post.body.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
      <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-8 border-t border-line pt-8">
        {dishes.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-h3 font-semibold text-ink">Dónde probarlos</h2>
            <ul className="flex flex-wrap gap-2">
              {dishes.map((dish) => (
                <li key={dish.id}>
                  <Link to={`/platillos/${dish.slug}`} className={chipStyles()}>
                    {dish.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ShareButton
          title={post.title}
          text={post.excerpt}
          url={absoluteUrl(path)}
          className="self-start"
        />
      </div>
      {others.length > 0 && (
        <aside aria-labelledby="sigue-leyendo" className="mx-auto mt-16 max-w-5xl">
          <h2 id="sigue-leyendo" className="text-h2 font-bold text-ink">
            Sigue leyendo
          </h2>
          <ul className="mt-6 grid gap-8 tablet:grid-cols-3">
            {others.map((other) => (
              <li key={other.id}>
                <Link to={`/blog/${other.slug}`} className="group flex flex-col gap-3">
                  <Photo
                    {...responsiveImage(other.cover, {
                      ratio: '3/2',
                      sizes: '(min-width: 768px) 33vw, 100vw',
                    })}
                    ratio="3/2"
                    zoomOnHover
                  />
                  <span className="text-h3 font-semibold text-ink group-hover:underline">
                    {other.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  )
}
