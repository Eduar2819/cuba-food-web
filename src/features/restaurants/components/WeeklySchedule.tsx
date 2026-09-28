import { CalendarClock } from 'lucide-react'
import { formatISODate } from '@/shared/lib/dates'
import { cn } from '@/shared/lib/cn'
import { getWeeklySchedule } from '../services/weeklySchedule'
import type { Schedule, SpecialSchedule } from '../types'

/** Horario semanal (lunes a domingo) con el día actual resaltado y excepciones próximas. */
export function WeeklySchedule({
  schedule,
  specialSchedules,
  now,
}: {
  schedule: Schedule
  specialSchedules: SpecialSchedule[]
  now: Date
}) {
  const rows = getWeeklySchedule(schedule, specialSchedules, now)
  const specials = [
    ...new Map(rows.filter((r) => r.special).map((r) => [r.special!.id, r.special!])).values(),
  ]

  return (
    <div className="flex flex-col gap-4">
      {specials.map((special) => (
        <p
          key={special.id}
          className="flex items-start gap-2 rounded-md bg-status-soon-soft p-3 text-small text-ink"
        >
          <CalendarClock aria-hidden size={18} className="mt-0.5 shrink-0 text-status-soon" />
          <span>
            <strong className="font-semibold">{special.label}</strong>{' '}
            {special.from === special.to
              ? `el ${formatISODate(special.from)}`
              : `del ${formatISODate(special.from)} al ${formatISODate(special.to)}`}
            {special.kind === 'closed' ? ': cerrado.' : '.'}
          </span>
        </p>
      ))}
      <table className="w-full text-small">
        <caption className="sr-only">Horario de la semana</caption>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.weekday}
              aria-current={row.isToday ? 'date' : undefined}
              className={cn(row.isToday && 'bg-surface-sunken font-semibold')}
            >
              <th
                scope="row"
                className="rounded-l-md py-2.5 pr-4 pl-3 text-left font-medium text-ink"
              >
                {row.dayName}
                {row.isToday && (
                  <span className="ml-2 text-caption font-semibold text-accent-text">Hoy</span>
                )}
              </th>
              <td
                className={cn(
                  'rounded-r-md py-2.5 pr-3 text-right tabular-nums',
                  row.ranges.length ? 'text-ink' : 'text-ink-muted',
                )}
              >
                {row.text.split(' y ').map((part) => (
                  <span key={part} className="block whitespace-nowrap">
                    {part}
                  </span>
                ))}
                {row.special && <span className="sr-only"> ({row.special.label})</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
