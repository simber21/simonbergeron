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
          href="https://github.com/simonbergeron"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-terminal-green transition-colors"
        >
          github ↗
        </a>
        <a
          href="https://linkedin.com/in/simonbergeron"
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
