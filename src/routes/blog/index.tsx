import { createFileRoute } from '@tanstack/react-router'
import { Effect } from 'effect'
import { getAllPosts } from '../../lib/posts'
import { TerminalBlock } from '../../components/TerminalBlock'
import { BlogPostList } from '../../components/BlogPostList'

export const Route = createFileRoute('/blog/')({
  loader: () => Effect.runSync(getAllPosts()),
  component: BlogPage,
})

function BlogPage() {
  const posts = Route.useLoaderData()
  return (
    <div className="max-w-3xl mx-auto">
      <TerminalBlock command="ls blog/">
        <BlogPostList posts={posts} />
      </TerminalBlock>
    </div>
  )
}
