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
