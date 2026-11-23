import Link from "next/link";
import { Icon } from "@dsaster/ui";
import { EventPreview } from "@/api/search";
import { formatEventDate } from "@/app/lib/date";

interface EventRowProps {
  readonly event: EventPreview;
}

export default function EventRow({ event }: Readonly<EventRowProps>) {
  const { day, month, time } = formatEventDate(event.date);

  return (
    <article className="group relative flex flex-col items-start gap-4 py-6 transition-colors hover:bg-surface-100 sm:flex-row sm:items-center sm:gap-8 sm:rounded-(--radius-lg) sm:px-4 sm:py-8">
      {/* Date block */}
      <div className="flex shrink-0 items-baseline gap-2 sm:w-28 sm:flex-col sm:items-start sm:gap-0">
        <span className="font-display text-3xl leading-none text-ink sm:text-4xl">
          {day}
        </span>
        <span className="text-label uppercase text-brand-text">{month}</span>
        <span className="text-mono-s text-ink-muted sm:mt-1">{time}</span>
      </div>

      {/* Event Details */}
      <div className="min-w-0 flex-1">
        <h3 className="text-heading-s text-ink transition-colors group-hover:text-brand-text sm:text-heading-m">
          <Link
            href={`/events/${event.id}`}
            className="focus:outline-none focus:underline after:absolute after:inset-0"
          >
            {event.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-body text-ink-muted">{event.artist}</p>
      </div>

      {/* Venue & Action */}
      <div className="flex w-full shrink-0 items-center justify-between gap-4 pt-2 sm:w-auto sm:flex-col sm:items-end sm:pt-0">
        <span className="text-body-s font-medium text-ink sm:text-right">
          {event.venueName}
        </span>
        <span className="inline-flex items-center gap-1 text-body-s font-semibold text-brand-text opacity-0 transition-opacity group-hover:opacity-100 sm:mt-1">
          Entradas
          <Icon name="chevron-right" size={16} />
        </span>
      </div>
    </article>
  );
}
