type Props = { label: string }

export function AuthDivider({ label }: Props) {
  return (
    <div className="relative py-1 text-center text-xs text-muted">
      <span className="relative z-10 bg-surface px-2">{label}</span>
      <div className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden />
    </div>
  )
}
