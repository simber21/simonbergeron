import { Effect, Array as A, Order, pipe } from 'effect'
import type { ComponentType } from 'react'

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

export interface Post extends PostMeta {
  component: ComponentType
}

// Vite eager glob — imports all MDX modules at build time
const modules = import.meta.glob('../content/posts/*.mdx', { eager: true }) as Record<
  string,
  { default: ComponentType; frontmatter: Omit<PostMeta, 'slug'> }
>

const parseSlug = (path: string): string =>
  path.replace('../content/posts/', '').replace('.mdx', '')

export const getAllPosts = (): Effect.Effect<Post[]> =>
  Effect.sync(() =>
    pipe(
      Object.entries(modules),
      A.map(([path, mod]) => ({
        slug: parseSlug(path),
        ...mod.frontmatter,
        component: mod.default,
      })),
      A.sort(Order.make((a: Post, b: Post) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)))
    )
  )

export const getPost = (slug: string): Effect.Effect<Post, Error> =>
  Effect.gen(function* () {
    const posts = yield* getAllPosts()
    const post = posts.find((p) => p.slug === slug)
    if (!post) return yield* Effect.fail(new Error(`Post not found: ${slug}`))
    return post
  })
