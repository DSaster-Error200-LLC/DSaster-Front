import Link from "next/link";
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
    <article className="mx-auto max-w-xl px-6 py-12">
      <Link
        href={`/events/${event.id}`}
        className="inline-flex rounded-(--radius-sm) text-body-s font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
      >
        Volver al evento
      </Link>

      <h1 className="mt-8 text-display-l uppercase text-ink">
        Seleccionar Asiento
      </h1>

      <section
        aria-labelledby="event-summary-heading"
        className="mb-8 mt-6 space-y-2 border-b border-line pb-8"
      >
        <h2
          id="event-summary-heading"
          className="wrap-break-word text-heading-m text-ink"
        >
          {event.name}
        </h2>
        <p className="text-body text-ink-muted">{event.artist}</p>
        <p className="text-body text-ink-muted">
          <time dateTime={event.date}>
            {day} {month}, {time}
          </time>
        </p>
        <p className="text-body font-semibold text-ink">{event.venue.name}</p>
        <p className="text-body-s text-ink-muted">{event.venue.location}</p>
      </section>

      <PurchaseForm key={event.id} event={event} />
    </article>
  );
}
