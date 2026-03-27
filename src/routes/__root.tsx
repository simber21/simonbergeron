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
