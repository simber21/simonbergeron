# simonbergeron.dev

Personal website for Simon Bergeron — terminal-aesthetic developer portfolio.

## Tech Stack

- **Runtime:** Bun
- **Bundler:** Vite (required for @tailwindcss/vite, @mdx-js/rollup, @tanstack/router-vite-plugin)
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (theme defined via @theme in src/index.css — no tailwind.config.ts)
- **Routing:** TanStack Router (file-based, src/routes/)
- **Blog:** MDX files in src/content/posts/ with frontmatter
- **Data:** Effect-TS (src/lib/posts.ts)
- **Deploy:** Cloudflare Pages via Wrangler CLI

## Commands

- `bun run dev` — start dev server
- `bun run build` — production build to dist/
- `bun run typecheck` — TypeScript type check
- `bunx wrangler pages deploy dist/` — deploy to Cloudflare Pages
