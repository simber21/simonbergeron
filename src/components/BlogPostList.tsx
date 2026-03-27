import { Link } from '@tanstack/react-router'
import type { PostMeta } from '../lib/posts'

interface BlogPostListProps {
  posts: PostMeta[]
}

export function BlogPostList({ posts }: BlogPostListProps) {
  return (
    <ul className="flex flex-col gap-4">
      {posts.map((post) => (
        <li key={post.slug} className="flex justify-between items-baseline border-b border-terminal-border pb-4">
          <Link
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="text-terminal-text text-sm hover:text-terminal-green transition-colors"
          >
            {post.title}
          </Link>
          <span className="text-terminal-dim text-xs shrink-0 ml-4">{post.date}</span>
        </li>
      ))}
    </ul>
  )
}
