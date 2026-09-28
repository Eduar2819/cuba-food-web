import { cn } from '@/shared/lib/cn'

export function chipStyles({
  selected = false,
  tone = 'default',
}: { selected?: boolean; tone?: 'default' | 'onPhoto' } = {}): string {
  return cn(
    'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-small font-medium whitespace-nowrap',
    'transition-[background-color,color,box-shadow,transform] duration-(--dur-micro) ease-out-soft active:scale-[0.97]',
    selected
      ? 'bg-brand text-on-brand ring-1 ring-brand ring-inset'
      : tone === 'onPhoto'
        ? 'bg-white/92 text-anil-950 hover:bg-white'
        : 'bg-surface text-ink ring-1 ring-line-strong ring-inset hover:bg-surface-sunken',
  )
}
