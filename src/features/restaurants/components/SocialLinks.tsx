import { ExternalLink } from 'lucide-react'
import type { SocialPlatform, SocialProfile } from '../types'

const PLATFORM: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  x: 'X',
  youtube: 'YouTube',
}

/** "Síguelo": solo enlaces externos (sin incrustar contenido de terceros). */
export function SocialLinks({ profiles }: { profiles: SocialProfile[] }) {
  if (profiles.length === 0) return null
  return (
    <ul className="flex flex-col gap-2">
      {profiles.map((profile) => (
        <li key={profile.platform}>
          <a
            href={profile.url}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-12 items-center justify-between gap-3 rounded-md bg-surface-sunken px-4 transition-colors duration-(--dur-micro) hover:bg-line"
          >
            <span className="flex flex-col">
              <span className="text-small font-semibold text-ink">
                {PLATFORM[profile.platform]}
              </span>
              <span className="text-caption text-ink-muted">{profile.handle}</span>
            </span>
            <ExternalLink aria-hidden size={18} className="text-ink-muted" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
