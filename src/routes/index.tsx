import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="px-6 py-20 text-terminal-green">
      Site coming soon...
    </div>
  ),
})
