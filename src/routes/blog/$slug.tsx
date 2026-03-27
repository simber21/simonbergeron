import { createFileRoute, notFound } from '@tanstack/react-router'
import { Effect } from 'effect'
import { getPost } from '../../lib/posts'
import { TerminalBlock } from '../../components/TerminalBlock'

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) =>
    Effect.runPromise(
      Effect.catchAll(getPost(params.slug), () => Effect.fail(notFound()))
    ),
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="max-w-3xl mx-auto px-6 py-12 text-terminal-muted text-sm">
      Post not found.
    </div>
  ),
})

function BlogPostPage() {
  const post = Route.useLoaderData()
  const PostComponent = post.component
  return (
    <div className="max-w-3xl mx-auto">
      <TerminalBlock command={`cat blog/${post.slug}.mdx`}>
        <div className="mb-8">
          <h1 className="text-terminal-green text-2xl font-bold mb-2">{post.title}</h1>
          <div className="flex gap-4 text-terminal-dim text-xs">
            <span>{post.date}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="text-terminal-dim">#{tag}</span>
            ))}
          </div>
        </div>
        <article className="prose prose-invert prose-sm max-w-none text-terminal-text leading-relaxed">
          <PostComponent />
        </article>
      </TerminalBlock>
    </div>
  )
}
