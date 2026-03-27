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
