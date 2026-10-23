import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SocialPlatform, SocialProfile } from '../types'

/* Glifos monocromos simplificados de cada red (heredan currentColor). */
const GLYPH: Record<SocialPlatform, ReactNode> = {
  instagram: (
    <>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </>
  ),
  facebook: (
    <path
      fill="currentColor"
      d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H7.6v3h2.6V21h3.3z"
    />
  ),
  tiktok: (
    <path
      fill="currentColor"
      d="M15.6 3c.3 2.4 1.8 4 4.4 4.3v3.1c-1.6 0-3.1-.5-4.4-1.4v6.2a5.6 5.6 0 1 1-5.6-5.6l.9.1v3.2a2.5 2.5 0 1 0 1.6 2.3V3h3.1z"
    />
  ),
  x: (
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      d="M5 4.5 19 19.5M19 4.5 5 19.5"
    />
  ),
  youtube: (
    <>
      <rect
        x="2.5"
        y="5.5"
        width="19"
        height="13"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path fill="currentColor" d="m10 9 5 3-5 3V9z" />
    </>
  ),
}

const PLATFORM: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  x: 'X',
  youtube: 'YouTube',
}

/** Redes sociales: solo enlaces externos (sin incrustar contenido de terceros). */
export function SocialLinks({ profiles }: { profiles: SocialProfile[] }) {
  if (profiles.length === 0) return null
  return (
    <ul className="grid gap-2">
      {profiles.map((profile) => (
        <li key={profile.platform}>
          <a
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            className="group flex min-h-14 items-center gap-3 rounded-lg bg-surface p-2.5 pr-4 ring-1 ring-line transition-[box-shadow,transform] duration-(--dur-normal) ease-out-soft hover:-translate-y-px hover:shadow-medium hover:ring-line-strong active:translate-y-0"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-md bg-surface-inverse text-ink-inverse">
              <svg aria-hidden viewBox="0 0 24 24" className="size-5">
                {GLYPH[profile.platform]}
              </svg>
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-small font-semibold text-ink">
                {PLATFORM[profile.platform]}
              </span>
              <span className="truncate text-caption text-ink-muted">{profile.handle}</span>
            </span>
            <ArrowUpRight
              aria-hidden
              size={18}
              className="text-ink-muted transition-transform duration-(--dur-normal) ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
            />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
