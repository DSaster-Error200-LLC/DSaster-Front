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
        className="inline-flex rounded-sm text-sm font-medium text-brand-muted transition-colors hover:text-brand-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-rust"
      >
        Volver al evento
      </Link>

      <h1 className="mt-8 font-display text-4xl font-extrabold tracking-tight text-brand-ink sm:text-5xl">
        Comprar Ticket
      </h1>

      <section
        aria-labelledby="event-summary-heading"
        className="mb-8 mt-6 space-y-2 border-b border-brand-border pb-8"
      >
        <h2
          id="event-summary-heading"
          className="wrap-break-word font-display text-2xl font-bold text-brand-ink"
        >
          {event.name}
        </h2>
        <p className="text-brand-muted">{event.artist}</p>
        <p className="text-brand-muted">
          <time dateTime={event.date}>
            {day} {month}, {time}
          </time>
        </p>
        <p className="font-medium text-brand-ink">{event.venue.name}</p>
        <p className="text-sm text-brand-muted">{event.venue.location}</p>
      </section>

      <PurchaseForm key={event.id} eventId={event.id} />
    </article>
  );
}
