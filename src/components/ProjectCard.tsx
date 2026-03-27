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
