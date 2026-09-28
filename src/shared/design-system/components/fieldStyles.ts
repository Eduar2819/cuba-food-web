export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`
  if (hint) return `${id}-hint`
  return undefined
}

export const controlBase =
  'w-full min-h-12 rounded-md bg-surface text-body text-ink ring-1 ring-inset ring-line-strong ' +
  'placeholder:text-ink-muted transition-shadow duration-(--dur-micro) ease-out-soft ' +
  'hover:ring-arena-400 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-focus ' +
  'aria-invalid:ring-2 aria-invalid:ring-danger disabled:opacity-60'
