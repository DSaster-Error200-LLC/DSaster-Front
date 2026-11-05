import Link from "next/link";
import { Icon } from "@dsaster/ui";
import type { Event } from "@/api/search";
import PurchaseForm from "@/app/events/[eventId]/purchase/PurchaseForm";
import { formatEventDate } from "@/app/lib/date";

interface PurchaseDetailsProps {
  readonly event: Event;
}

export default function PurchaseDetails({
  event,
}: Readonly<PurchaseDetailsProps>) {
  const { day, month, time } = formatEventDate(event.date);

  return (
    <article className="mx-auto max-w-xl px-(--space-4) py-(--space-6) sm:px-(--space-5) sm:py-(--space-7)">
      <Link
        href={`/events/${event.id}`}
        className="inline-flex items-center gap-(--space-1) rounded-(--radius-sm) text-body-s font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        <Icon name="chevron-left" size={16} />
        Volver al evento
      </Link>

      <h1 className="mt-(--space-5) text-display-l text-ink">
        Seleccionar Asiento
      </h1>

      <section
        aria-labelledby="event-summary-heading"
        className="mt-(--space-5) mb-(--space-6) grid gap-(--space-2) border-b border-line pb-(--space-6)"
      >
        <h2
          id="event-summary-heading"
          className="wrap-break-word text-heading-m text-ink"
        >
          {event.name}
        </h2>
        <p className="text-body text-ink-muted">{event.artist}</p>
        <p className="flex items-center gap-(--space-2) text-body text-ink-muted">
          <Icon name="calendar" size={14} />
          <time dateTime={event.date}>
            {day} {month}, {time}
          </time>
        </p>
        <p className="flex items-center gap-(--space-2) text-body font-semibold text-ink">
          <Icon name="map-pin" size={14} />
          {event.venue.name}
        </p>
        <p className="text-body-s text-ink-muted">{event.venue.location}</p>
      </section>

      <PurchaseForm key={event.id} event={event} />
    </article>
  );
}
