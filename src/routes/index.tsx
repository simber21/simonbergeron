import { createFileRoute, Link } from '@tanstack/react-router'
import { Effect } from 'effect'
import { getAllPosts } from '../lib/posts'
import { TerminalBlock } from '../components/TerminalBlock'
import { ProjectCard } from '../components/ProjectCard'
import { BlogPostList } from '../components/BlogPostList'

// Hardcoded project data — update with your real projects
const PROJECTS = [
  {
    name: 'project-name',
    description: 'Short description of what this project does and why it exists.',
    tags: ['TypeScript', 'Effect-TS', 'Bun'],
    github: 'https://github.com/simonbergeron/project-name',
  },
]

export const Route = createFileRoute('/')({
  loader: () => Effect.runSync(getAllPosts()),
  component: HomePage,
})

function HomePage() {
  const posts = Route.useLoaderData()
  const recentPosts = posts.slice(0, 3)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Hero */}
      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-terminal-dim text-xs mb-2">$ whoami</div>
        <h1 className="text-terminal-green text-4xl font-bold tracking-tight leading-tight mb-2">
          Simon Bergeron
        </h1>
        <p className="text-terminal-muted text-sm mb-6">Software Developer · Canada</p>
        <p className="text-terminal-text text-sm leading-relaxed max-w-lg mb-8">
          I build reliable, well-typed systems. Interested in functional programming,
          distributed systems, and developer tooling.
        </p>
        <div className="flex gap-4">
          <a
            href="#projects"
            className="border border-terminal-green text-terminal-green text-xs px-4 py-2 hover:bg-terminal-green hover:text-terminal-bg transition-colors"
          >
            view projects
          </a>
          <Link
            to="/blog"
            className="border border-terminal-border text-terminal-muted text-xs px-4 py-2 hover:border-terminal-muted transition-colors"
          >
            read blog
          </Link>
        </div>
      </section>

      {/* About */}
      <TerminalBlock command="cat about.txt" id="about">
        <p className="text-terminal-text text-sm leading-relaxed max-w-xl">
          {/* YOUR BIO HERE — replace this before deploying */}
          A few sentences about who you are, what you care about technically,
          and what you're currently working on.
        </p>
      </TerminalBlock>

      {/* Projects */}
      <TerminalBlock command="ls projects/" id="projects">
        <div className="grid gap-4">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.name} {...project} />
          ))}
        </div>
      </TerminalBlock>

      {/* Blog preview */}
      <TerminalBlock command={`ls blog/ | head -3`} id="blog">
        <BlogPostList posts={recentPosts} />
        {posts.length > 3 && (
          <Link
            to="/blog"
            className="inline-block mt-4 text-terminal-dim text-xs hover:text-terminal-green transition-colors"
          >
            view all posts →
          </Link>
        )}
      </TerminalBlock>

      {/* Footer */}
      <footer className="border-t border-terminal-border px-4 sm:px-6 py-6 flex flex-col sm:flex-row justify-between gap-1 text-terminal-dim text-xs">
        <span>© 2026 Simon Bergeron</span>
        <span>simonbergeron.dev</span>
      </footer>
    </div>
  )
}
