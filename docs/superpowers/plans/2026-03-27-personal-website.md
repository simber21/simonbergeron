# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build simonbergeron.dev — a terminal-aesthetic personal website with About, Projects, Blog sections deployed to Cloudflare Pages.

**Architecture:** Single Vite + React SPA with TanStack Router. Main page is a single scrolling layout; blog posts are MDX files compiled at build time via `@mdx-js/rollup`. Effect-TS wraps the post-loading pipeline for typed, safe data access.

**Tech Stack:** Bun, Vite, React 19, TypeScript, Tailwind CSS, TanStack Router, Effect-TS, MDX (`@mdx-js/rollup`), gray-matter, Wrangler CLI, Cloudflare Pages.

---

## File Map

| File | Responsibility |
|------|---------------|
| `vite.config.ts` | Vite config with MDX plugin and TanStack Router |
| `tailwind.config.ts` | Terminal color palette and custom font config |
| `src/index.css` | Tailwind directives + CSS variables for terminal theme |
| `src/main.tsx` | App entry point, router setup |
| `src/router.tsx` | TanStack Router instance |
| `src/routes/__root.tsx` | Root layout: Nav + `<Outlet />` |
| `src/routes/index.tsx` | Main scrolling page: Hero, About, Projects, Blog preview |
| `src/routes/blog/index.tsx` | Full blog post listing |
| `src/routes/blog/$slug.tsx` | Individual blog post renderer |
| `src/components/Nav.tsx` | Fixed top nav bar with anchor links + external links |
| `src/components/TerminalLine.tsx` | Renders `$ command` prompt lines |
| `src/components/TerminalBlock.tsx` | Section wrapper with CLI framing |
| `src/components/ProjectCard.tsx` | Project: name, description, tech tags, links |
| `src/components/BlogPostList.tsx` | Sorted list of posts with dates |
| `src/lib/posts.ts` | Effect-TS: collect, parse, sort posts via `import.meta.glob` |
| `src/content/posts/hello-world.mdx` | Sample post to verify pipeline |
| `wrangler.toml` | Cloudflare Pages project config |
| `.github/workflows/deploy.yml` | CI: build + deploy on push to main |

---

## Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts`, `src/index.css`, `src/main.tsx`, `index.html`

- [ ] **Step 1: Initialize Bun project**

```bash
cd /home/simberg/typescript/simonbergeron
bun init -y
```

- [ ] **Step 2: Install dependencies**

```bash
bun add react react-dom @tanstack/react-router effect
bun add -d typescript @types/react @types/react-dom vite @vitejs/plugin-react tailwindcss @tailwindcss/vite @mdx-js/rollup @mdx-js/react remark-frontmatter remark-mdx-frontmatter @tanstack/router-vite-plugin
```

- [ ] **Step 3: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Write `vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter] }) },
    react(),
    TanStackRouterVite(),
  ],
})
```

- [ ] **Step 5: Write `tailwind.config.ts`**

```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d0d16',
          border: '#1e1e2e',
          green: '#00ff9f',
          dim: '#555555',
          muted: '#888888',
          text: '#c9d1d9',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'monospace'],
      },
    },
  },
} satisfies Config
```

- [ ] **Step 6: Write `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
@import "tailwindcss";
```

- [ ] **Step 7: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simon Bergeron</title>
  </head>
  <body class="bg-terminal-bg text-terminal-text font-mono">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Verify dev server starts**

```bash
bun run dev
```
Expected: Vite dev server running at `http://localhost:5173` (or similar port) with no errors.

- [ ] **Step 9: Commit**

```bash
git init
git add package.json tsconfig.json vite.config.ts tailwind.config.ts src/index.css index.html bun.lockb
git commit -m "feat: scaffold Vite + React + Tailwind + MDX + TanStack Router project"
```

---

## Task 2: Router + Root Layout

**Files:**
- Create: `src/router.tsx`, `src/main.tsx`, `src/routes/__root.tsx`, `src/components/Nav.tsx`

- [ ] **Step 1: Write `src/components/Nav.tsx`**

```tsx
export function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-terminal-bg border-b border-terminal-border">
      <span className="text-terminal-green font-bold text-sm tracking-tight">
        ~/simonbergeron
      </span>
      <div className="flex gap-6 text-xs text-terminal-muted">
        <a href="#about" className="hover:text-terminal-text transition-colors">about</a>
        <a href="#projects" className="hover:text-terminal-text transition-colors">projects</a>
        <a href="#blog" className="hover:text-terminal-text transition-colors">blog</a>
        <a
          href="https://github.com/simber21"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-terminal-green transition-colors"
        >
          github ↗
        </a>
        <a
          href="https://linkedin.com/in/simon-bergeron-0aa95ba4"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-terminal-green transition-colors"
        >
          linkedin ↗
        </a>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Write `src/routes/__root.tsx`**

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Nav } from '../components/Nav'

export const Route = createRootRoute({
  component: () => (
    <>
      <Nav />
      <main className="pt-16">
        <Outlet />
      </main>
    </>
  ),
})
```

- [ ] **Step 3: Write `src/router.tsx`**

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

- [ ] **Step 4: Write `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
```

- [ ] **Step 5: Verify router renders**

```bash
bun run dev
```
Expected: Page loads with nav bar visible, no console errors.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add TanStack Router with root layout and Nav component"
```

---

## Task 3: Terminal Primitives

**Files:**
- Create: `src/components/TerminalLine.tsx`, `src/components/TerminalBlock.tsx`

- [ ] **Step 1: Write `src/components/TerminalLine.tsx`**

```tsx
interface TerminalLineProps {
  command: string
}

export function TerminalLine({ command }: TerminalLineProps) {
  return (
    <div className="text-terminal-dim text-xs mb-3">
      <span className="mr-2">$</span>
      <span className="text-terminal-text">{command}</span>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/components/TerminalBlock.tsx`**

```tsx
import { TerminalLine } from './TerminalLine'

interface TerminalBlockProps {
  command: string
  id?: string
  children: React.ReactNode
}

export function TerminalBlock({ command, id, children }: TerminalBlockProps) {
  return (
    <section id={id} className="py-12 px-6 border-t border-terminal-border max-w-3xl mx-auto">
      <TerminalLine command={command} />
      {children}
    </section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalLine.tsx src/components/TerminalBlock.tsx
git commit -m "feat: add TerminalLine and TerminalBlock primitive components"
```

---

## Task 4: Post Loading Pipeline

**Files:**
- Create: `src/lib/posts.ts`, `src/content/posts/hello-world.mdx`

- [ ] **Step 1: Write `src/content/posts/hello-world.mdx`**

```mdx
---
title: Hello World
date: 2026-03-27
description: First post on my new site.
tags: [meta]
---

Welcome to my blog. This is a sample post to verify the pipeline works.
```

- [ ] **Step 2: Write `src/lib/posts.ts`**

```ts
import { Effect, Array as A, pipe } from 'effect'

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
}

export interface Post extends PostMeta {
  component: React.ComponentType
}

// Vite eager glob — imports all MDX modules at build time
const modules = import.meta.glob('../content/posts/*.mdx', { eager: true }) as Record<
  string,
  { default: React.ComponentType; frontmatter: Omit<PostMeta, 'slug'> }
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
      A.sort({ compare: (a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0) })
    )
  )

export const getPost = (slug: string): Effect.Effect<Post, Error> =>
  Effect.gen(function* () {
    const posts = yield* getAllPosts()
    const post = posts.find((p) => p.slug === slug)
    if (!post) return yield* Effect.fail(new Error(`Post not found: ${slug}`))
    return post
  })
```

- [ ] **Step 3: Add MDX type declaration**

Create `src/types/mdx.d.ts`:

```ts
declare module '*.mdx' {
  import type { ComponentType } from 'react'
  const component: ComponentType
  export default component
  export const frontmatter: Record<string, unknown>
}
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/posts.ts src/content/posts/hello-world.mdx src/types/mdx.d.ts
git commit -m "feat: add Effect-TS post loading pipeline with MDX glob"
```

---

## Task 5: Blog Routes

**Files:**
- Create: `src/routes/blog/index.tsx`, `src/routes/blog/$slug.tsx`, `src/components/BlogPostList.tsx`

- [ ] **Step 1: Write `src/components/BlogPostList.tsx`**

```tsx
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
```

- [ ] **Step 2: Write `src/routes/blog/index.tsx`**

```tsx
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
```

- [ ] **Step 3: Write `src/routes/blog/$slug.tsx`**

```tsx
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
              <span key={tag} className="text-terminal-muted">#{tag}</span>
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
```

- [ ] **Step 4: Verify blog routes work**

```bash
bun run dev
```
Navigate to `/blog` — hello-world post should appear. Click it — post content should render.

- [ ] **Step 5: Commit**

```bash
git add src/routes/blog/ src/components/BlogPostList.tsx
git commit -m "feat: add blog listing and post routes with MDX renderer"
```

---

## Task 6: Main Page

**Files:**
- Create: `src/routes/index.tsx`, `src/components/ProjectCard.tsx`

- [ ] **Step 1: Write `src/components/ProjectCard.tsx`**

```tsx
interface ProjectCardProps {
  name: string
  description: string
  tags: string[]
  github?: string
  live?: string
}

export function ProjectCard({ name, description, tags, github, live }: ProjectCardProps) {
  return (
    <div className="border border-terminal-border p-4 hover:border-terminal-green transition-colors">
      <div className="text-terminal-green text-sm font-bold mb-1">{name}</div>
      <div className="text-terminal-muted text-xs mb-3 leading-relaxed">{description}</div>
      <div className="flex gap-2 mb-3 flex-wrap">
        {tags.map((tag) => (
          <span key={tag} className="text-terminal-dim text-xs">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4">
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer"
            className="text-terminal-dim text-xs hover:text-terminal-green transition-colors">
            github ↗
          </a>
        )}
        {live && (
          <a href={live} target="_blank" rel="noopener noreferrer"
            className="text-terminal-dim text-xs hover:text-terminal-green transition-colors">
            live ↗
          </a>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `src/routes/index.tsx`**

```tsx
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
      <section className="px-6 py-20">
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
      <footer className="border-t border-terminal-border px-6 py-6 flex justify-between text-terminal-dim text-xs">
        <span>© 2026 Simon Bergeron</span>
        <span>simonbergeron.dev</span>
      </footer>
    </div>
  )
}
```

- [ ] **Step 3: Verify full page renders**

```bash
bun run dev
```
Expected: Homepage renders with all sections — hero, about, projects, blog preview, footer. Nav anchor links scroll to correct sections.

- [ ] **Step 4: Commit**

```bash
git add src/routes/index.tsx src/components/ProjectCard.tsx
git commit -m "feat: add main scrolling homepage with all sections"
```

---

## Task 7: Deployment Config

**Files:**
- Create: `wrangler.toml`, `.github/workflows/deploy.yml`, `.gitignore`

- [ ] **Step 1: Write `wrangler.toml`**

```toml
name = "simonbergeron"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"
```

- [ ] **Step 2: Write `.gitignore`**

```
node_modules/
dist/
.wrangler/
.superpowers/
*.local
```

- [ ] **Step 3: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Build
        run: bun run build

      - name: Deploy to Cloudflare Pages
        run: bunx wrangler pages deploy dist/ --project-name simonbergeron
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

- [ ] **Step 4: Update `package.json` build scripts and fill in personal content**

Ensure `package.json` scripts are correct (see Step 4b). Also update these two placeholders in `src/routes/index.tsx` before deploying:
- `PROJECTS` array — replace with your real project(s)
- About section bio paragraph — replace placeholder text with your actual bio

- [ ] **Step 4b: Add build script to `package.json`**

Ensure `package.json` has:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

- [ ] **Step 5: Verify production build**

```bash
bun run build
```
Expected: `dist/` directory created, no TypeScript errors, build completes cleanly.

- [ ] **Step 6: Test Cloudflare deployment**

```bash
bunx wrangler pages deploy dist/ --project-name simonbergeron
```
Expected: Site deployed, preview URL printed. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` set in environment or `~/.wrangler/config`.

- [ ] **Step 7: Commit**

```bash
git add wrangler.toml .gitignore .github/
git commit -m "feat: add Wrangler deploy config and GitHub Actions CI workflow"
```

---

## Verification Checklist

- [ ] `bun run dev` — site loads, all sections scroll correctly, nav links work
- [ ] `/blog` — hello-world post appears in list
- [ ] `/blog/hello-world` — post content renders with title, date, tags
- [ ] `/blog/nonexistent` — 404 message shown, no crash
- [ ] `bun run build` — completes with no TypeScript errors
- [ ] `bunx wrangler pages deploy dist/` — site live at Cloudflare Pages preview URL
- [ ] Configure custom domain `simonbergeron.dev` in Cloudflare Pages dashboard (DNS CNAME → pages.dev)
