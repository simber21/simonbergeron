export function Nav() {
  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-4 sm:px-6 py-4 bg-terminal-bg border-b border-terminal-border">
      <span className="text-terminal-green font-bold text-sm tracking-tight">
        ~/simonbergeron
      </span>
      <div className="flex gap-4 sm:gap-6 text-xs text-terminal-muted">
        <a href="/#about" className="hidden sm:block hover:text-terminal-green transition-colors">about</a>
        <a href="/#projects" className="hidden sm:block hover:text-terminal-green transition-colors">projects</a>
        <a href="/#blog" className="hidden sm:block hover:text-terminal-green transition-colors">blog</a>
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
